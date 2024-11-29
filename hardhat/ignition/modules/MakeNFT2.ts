// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const MakeNFT2Module = buildModule("MakeNFT2Module", (m) => {
  const makeNFT2 = m.contract("MakeNFT2");

  return { makeNFT2 };
});

export default MakeNFT2Module;