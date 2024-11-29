require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PinataSDK } = require('pinata-web3');
const multer = require('multer');
const sqlite3 = require("sqlite3");
const Web3 = require('web3');
const _abi = require('./MakeNFT2.json');
const { ethers } = require("ethers");
const { Network, Alchemy, Wallet, ContractFactory } = require("alchemy-sdk");

const app = express();
const upload = multer();

// DB 설정
const db = new sqlite3.Database("./uris.db", err => {
    if(err) {
        return console.error(err.message);
    }
    
    // 기존 테이블 구조 확인 후 필요한 컬럼 추가
    db.run(`CREATE TABLE IF NOT EXISTS URIs (ID INTEGER, JsonCID TEXT)`, err => {
        if (err) {
            return console.error(err.message);
        }
        
        // ImgCID 컬럼 추가
        db.run(`ALTER TABLE URIs ADD COLUMN ImgCID TEXT`, err => {
            if (err && !err.message.includes('duplicate column name')) {
                return console.error(err.message);
            }
        });
    });
});

// CORS 설정
app.use(cors({
    origin: [process.env.ALLOWED_ORIGIN],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Web3 & Contract 설정
const web3 = new Web3.Web3(`https://polygonzkevm-cardona.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
const contractAddress = '0x59651fE3e72ADa6Ce1ba633A20f83d058e3350E7';
const contract = new web3.eth.Contract(_abi.abi, contractAddress);
const signer = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(signer);
web3.eth.defaultAccount = signer.address;

// Pinata 설정
const pinata = new PinataSDK({ pinataJwt: process.env.JWT_SECRET });

async function uploadToPinata(fileBuffer, name, interests, jobs, other, tokenId) {
    try {
        const file = new File([fileBuffer], 'profile.png');
        const uploadImage = await pinata.upload.file(file);

        const uploadMetadata = await pinata.upload.json({
            name: "Profile NFT",
            description: "This is Profile NFT for Meta Me",
            external_url: `https://gateway.pinata.cloud/ipfs/${uploadImage.IpfsHash}`,
            image: `ipfs://${uploadImage.IpfsHash}`,
            attributes: [
                {
                    trait_type: "Profile Image",
                    value: `https://gateway.pinata.cloud/ipfs/${uploadImage.IpfsHash}`
                },
                {
                    trait_type: "Name",
                    value: name
                },
                {
                    trait_type: "Interests",
                    value: interests
                },
                {
                    trait_type: "Jobs",
                    value: jobs
                },
                ...other
            ]
        });

        // DB에 CID 저장
        await new Promise((resolve, reject) => {
            const insert = db.prepare('INSERT INTO URIs (ID, ImgCID, JsonCID) VALUES (?, ?, ?)');
            insert.run(tokenId, uploadImage.IpfsHash, uploadMetadata.IpfsHash, err => {
                if (err) reject(err);
                resolve();
            });
            // db.run(`INSERT INTO URIs (ID, ImgCID, JsonCID) VALUES (?, ?, ?)`, 
            //     [tokenId, uploadImage.IpfsHash, uploadMetadata.IpfsHash], 
            //     err => {
            //         if (err) reject(err);
            //         resolve();
            //     }
            // );
        });

        return uploadMetadata.IpfsHash;
    } catch (error) {
        console.error("uploadToPinata Error:", error);
        throw error;
    }
}

async function deletePinataFile(tokenId) {
    try {
        // DB에서 CID 조회
        const data = await new Promise((resolve, reject) => {
            const select = db.prepare('SELECT ImgCID, JsonCID FROM URIs WHERE ID = ?');
            select.run(tokenId, (err, row) => {
                if (err) reject(err);
                if (!row) reject(new Error('Token ID not found'));
                resolve(row);
            });
            // db.get(`SELECT ImgCID, JsonCID FROM URIs WHERE ID = ?`, [tokenId], (err, row) => {
            //     if (err) reject(err);
            //     if (!row) reject(new Error('Token ID not found'));
            //     resolve(row);
            // });
        });

        // Pinata에서 파일 삭제
        await pinata.unpin([data.ImgCID, data.JsonCID]);

        // DB에서 레코드 삭제
        await new Promise((resolve, reject) => {
            const del = db.prepare('DELETE FROM URIs WHERE ID = ?');
            del.run(tokenId, err => {
                if (err) reject(err);
                resolve();
            });
            // db.run(`DELETE FROM URIs WHERE ID = ?`, [tokenId], err => {
            //     if (err) reject(err);
            //     resolve();
            // });
        });

        return true;
    } catch (error) {
        console.error("deletePinataFile Error:", error);
        throw error;
    }
}

const sendTransact = async (method, params) => {
    const gasPrice = await web3.eth.getGasPrice();
    var tx = {from : signer.address, to : contractAddress , gas : 500000, gasPrice : gasPrice, data : method(...params).encodeABI()};
    var signPromise = web3.eth.accounts.signTransaction(tx, signer.privateKey);
    signPromise.then((signedTx)=> {
        var sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
        return sentTx;
    })

}
const safeJsonStringify = (obj) => {
    return JSON.stringify(obj, (_, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value
    );
};

app.post('/api/create-profile', upload.single('file'), async (req, res) => {
    try {
        const { account, name, interests, jobs, other } = req.body;
        const fileBuffer = req.file.buffer;
        
        const uri = await uploadToPinata(fileBuffer, name, interests, jobs, JSON.parse(other), -1);
        
        const result = await sendTransact(contract.methods.mint, [account, uri]);
        const serializedResult = JSON.parse(safeJsonStringify(result));
        
        if (result.status) {
            const tokenId = await contract.methods.getTokenId(userAccount).call({ from: signer.address });
            await db.run(`UPDATE URIs SET ID = ? WHERE JsonCID = ?`, [tokenId, uri]);
        }
        
        res.setHeader('Content-Type', 'application/json');

        res.json({
            result: serializedResult
        });
    } catch (error) {
        console.error("Create profile error:", error);
        res.status(500).json({
            error: error.message,
        });
    }
});

app.post('/api/set-profile', upload.single('file'), async (req, res) => {
    try {
        const { account, name, interests, jobs, other } = req.body;
        const fileBuffer = req.file.buffer;
        
        const tokenId = await contract.methods.getTokenId(account).call({ from: signer.address });
        await deletePinataFile(Number(tokenId));
        
        const uri = await uploadToPinata(fileBuffer, name, interests, jobs, JSON.parse(other), tokenId);
        
        const result = await sendTransact(contract.methods.setNFT, [account, uri]);
        const serializedResult = JSON.parse(safeJsonStringify(result));
        
        res.setHeader('Content-Type', 'application/json');

        res.json({
            result: serializedResult
        });
    } catch (error) {
        console.error("Set profile error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/delete-profile', upload.none(), async (req, res) => {
    try {
        const { account } = req.body;
        const tokenId = await contract.methods.getTokenId(account).call({ from: signer.address });
        await deletePinataFile(Number(tokenId));
        
        const result = await sendTransact(contract.methods.deleteNFT, [account]);
        const serializedResult = JSON.parse(safeJsonStringify(result));
        
        res.setHeader('Content-Type', 'application/json');

        res.json({
            result: serializedResult
        });
        res.json({ result: result });
    } catch (error) {
        console.error("Delete profile error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/get-profile', upload.none(), async (req, res) => {
    try {
        const { account } = req.body;
        const tokenId = await contract.methods.getTokenId(account).call({ from: signer.address });
        const hash = await contract.methods.tokenURI(tokenId).call();
        
        const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
        const profile = await response.json();
        
        res.json({ result: profile });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/is-profile-created', upload.none(), async (req, res) => {
    try {
        const { account } = req.body;
        const exists = await contract.methods.isMinted(account).call({ from: signer.address });
        res.json({ result: exists });
    } catch (error) {
        console.error("Check profile error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/get-token-id', upload.none(), async (req, res) => {
    try {
        const { account } = req.body;
        const tokenId = await contract.methods.getTokenId(account).call({ from: signer.address });
        res.json({ result: tokenId.toString() });
    } catch (error) {
        console.error("Get token ID error:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
});