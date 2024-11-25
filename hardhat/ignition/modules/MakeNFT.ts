// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const MakeNFTModule = buildModule("MakeNFTModule", (m) => {
  const makeNFT = m.contract("MakeNFT");

  return { makeNFT };
});

export default MakeNFTModule;