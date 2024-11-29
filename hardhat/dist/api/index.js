require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PinataSDK } = require('pinata-web3');
const multer = require('multer');

const upload = multer();

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true
}));

app.use(express.json());

// Pinata
const JWT = process.env.JWT_SECRET;

const pinata = new PinataSDK({pinataJwt: JWT, pinataGateway: "https://gateway.pinata.cloud"});

async function uploadToPinata(fileBuffer, name, interests, jobs, other) {
  try {
    const file = new File([fileBuffer], 'profile.png', { type: 'image/png' });
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

    return uploadMetadata.IpfsHash;
  } catch (error) {
    console.error("uploadToPinata Error:", error);
    throw error;
  }
}

app.post('/api/upload-to-pinata', upload.single('file'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const { name, interests, jobs, other } = req.body;
    const uri = await uploadToPinata(fileBuffer, name, interests, jobs, JSON.parse(other));
    res.json({ uri: uri });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
}); 
