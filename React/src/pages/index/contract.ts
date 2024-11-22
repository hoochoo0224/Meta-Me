import { Web3 } from 'web3'

const abi = require("./../../../../hardhat/artifacts/contracts/Profile.sol/Profile.json");
const contractAddress = '';

export const web3 = new Web3("https://127.0.0.1:8545");
export const contract = new web3.eth.Contract(abi, contractAddress);