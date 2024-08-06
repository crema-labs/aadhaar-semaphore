import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@semaphore-protocol/hardhat";
// import "poseidon-solidity";
const config: HardhatUserConfig = {
  solidity: "0.8.23",
  dependencyCompiler: {
    paths: [],
  },
};

export default config;
