import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// import "@nomiclabs/hardhat-ethers";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    polygon: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/vvgIB-JCS2RG7FrICV9Tss9JqiYk3xiV", // Polygon 메인넷 RPC URL
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [], // 개인 키를 환경 변수에서 가져옴
    },
    polygonAmoy: {
      url: "https://polygon-amoy.g.alchemy.com/v2/vvgIB-JCS2RG7FrICV9Tss9JqiYk3xiV", // Polygon 테스트넷 RPC URL
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [], // 개인 키
    },
    polygon_zkEVM: {
	url: "https://polygonzkevm-cardona.g.alchemy.com/v2/vvgIB-JCS2RG7FrICV9Tss9JqiYk3xiV",
	accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },

  }
};

export default config;
