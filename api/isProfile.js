require('dotenv').config();const Web3 = require('web3');
const _abi = require('./MakeNFT2.json');const web3 = new Web3.Web3(`https://polygonzkevm-cardona.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
const contractAddress = '0x59651fE3e72ADa6Ce1ba633A20f83d058e3350E7';
const contract = new web3.eth.Contract(_abi.abi, contractAddress);
const signer = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(signer);
web3.eth.defaultAccount = signer.address;


(async ()=>{
            
    const result = await contract.methods.isMinted("0xf456dF9E429B405aF769A235d158E8a926f7df86").call({ from: signer.address });
    
    console.log(result);
})();