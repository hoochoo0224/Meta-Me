import { Web3 } from 'web3'

function uploadToPinata(file: File, name: string, interests: string, jobs: string, other: Array<{}>) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('interests', interests);
    formData.append('jobs', jobs);
    formData.append('other', JSON.stringify(other));
    
    return fetch('http://localhost:3001/api/upload-to-pinata', {
        method: 'POST',
        body: formData
    })
    .then(async response => {
        const text = await response.text();
        
        if (!response.ok) {
            throw new Error(`Upload response not ok: ${text}`);
        }
        
        return JSON.parse(text);
    })
    .then(data => {
        return data.uri;
    });
}

// MakeNFT Contract
import _abi from '../../../hardhat/artifacts/contracts/MakeNFT.sol/MakeNFT.json' assert { type: "json" };
export const abi = _abi.abi;
export const contractAddress = '0x4aBCCc507c01EAbe93c6748ae8E3AEc6c087325C';

export const web3 = new Web3(window.ethereum);
export const contract = new web3.eth.Contract(abi, contractAddress);

export const createProfile = async (account: any, file: File, name: string, interests: string, jobs: string, other: Array<{}>) => {
    try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0x98a') {  // Polygon zkEVM testnet
            try {
                await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x98a' }] });
            } catch (error: any) {
                if (error.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x98a',
                            chainName: 'Polygon zkEVM Testnet',
                            nativeCurrency: {
                                name: 'ETH',
                                symbol: 'ETH',
                                decimals: 18
                            },
                            rpcUrls: ['https://polygonzkevm-cardona.g.alchemy.com/v2/vvgIB-JCS2RG7FrICV9Tss9JqiYk3xiV'],
                            blockExplorerUrls: ['https://cardona-zkevm.polygonscan.com/']
                        }]
                    });
                }
                throw new Error('createProfile: switch network error');
            }
        }

        const uri = await uploadToPinata(file, name, interests, jobs, other);

        const gasEstimate = await contract.methods.mint(uri).estimateGas({ from: account });
        const gasPrice = await web3.eth.getGasPrice();
        const result = await contract.methods.mint(uri).send({ 
            from: account,
            gas: Math.floor(Number(gasEstimate) * 1.2),
            gasPrice: gasPrice
        });

        return result;
    } catch (error: any) {
        let errore = error.toString() 
        if (errore.indexOf('Internal JSON-RPC error.') > -1) {
            errore = errore.replace('\n', '').replace("Error: ", '').replace('Internal JSON-RPC error.', '')
            errore = JSON.parse(errore)
        }
        throw new Error(`createProfile: ${errore}`);
    }
};

export const setProfile = async (account: any, file: File, name: string, interests: string, jobs: string, other: Array<{}>) => {
    try {
        const uri = await uploadToPinata(file, name, interests, jobs, other);
        const gasEstimate = await contract.methods.setNFT(uri).estimateGas({ from: account });
        const gasPrice = await web3.eth.getGasPrice();
        const result = await contract.methods.setNFT(uri).send({ 
            from: account,
            gas: Math.floor(Number(gasEstimate) * 1.2),
            gasPrice: gasPrice
        });
        return result;
    } catch (error: any) {
        console.error('setProfile:', error);
        throw error;
    }
}

export const deleteProfile = async (account: any) => {
    try {
        const gasEstimate = await contract.methods.deleteNFT().estimateGas({ from: account });
        const gasPrice = await web3.eth.getGasPrice();
        const result = await contract.methods.deleteNFT().send({ 
            from: account,
            gas: Math.floor(Number(gasEstimate) * 1.2),
            gasPrice: gasPrice
        });
        return result;
    } catch (error: any) {
        console.error('deleteProfile:', error);
        throw error;
    }
}

export const getProfile = async (account: string) => {
    try {
        const isMinted = await contract.methods.isMinted().call({ from: account });
        if (!isMinted) {
            throw new Error('getProfile: isMinted false');
        }

        const tokenId = await contract.methods.getTokenId().call({ from: account });
        const hash = await contract.methods.tokenURI(tokenId).call();
        const url = `https://gateway.pinata.cloud/ipfs/${hash}`;
        const controller = new AbortController();

        try {
            const response = await fetch(url, {
                signal: controller.signal
            });
            
            if (!response.ok) {
                throw new Error(`getProfile response not ok: ${response.status}`);
            }

            const metadataJson = await response.json();

            const name = metadataJson.attributes.find(attr => attr.trait_type === "Name")?.value;
            const profileImage = metadataJson.attributes.find(attr => attr.trait_type === "Profile Image")?.value;
            const interests = metadataJson.attributes.find(attr => attr.trait_type === "Interests")?.value.split(',') || [];
            const jobs = metadataJson.attributes.find(attr => attr.trait_type === "Jobs")?.value.split(',') || [];

            if (profileImage.length === 0 || name.length === 0 || interests.length === 0 || jobs.length === 0) {
                throw new Error('getProfile: profileImage, name, interests, jobs is empty');
            }

            return {
                profileImage: profileImage,
                username: name,
                interests: interests,
                jobs: jobs
            };
        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw new Error('getProfile: fetch timeout');
            }
            throw error;
        }
    } catch (error: any) {
        console.error('getProfile:', error);
        throw error;
    }
}

export const isProfileCreated = async (account: string) => {
    try {
        const result = await contract.methods.isMinted().call({ from: account });
        return result;
    } catch (error: any) {
        console.error('isProfileCreated:', error);
        throw error;
    }
}

export const getTokenId = async (account: string) => {
    try {
        const result = await contract.methods.getTokenId().call({ from: account });
        return result;
    } catch (error: any) {
        console.error('getTokenId:', error);
        throw error;
    }
}

