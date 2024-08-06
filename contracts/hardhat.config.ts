import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@semaphore-protocol/hardhat";

const config: HardhatUserConfig = {
  solidity: "0.8.23",
  dependencyCompiler: {
    paths: [
      "@anon-aadhaar/contracts/src/Verifier.sol",
      "@anon-aadhaar/contracts/src/AnonAadhaar.sol",
    ],
  },
};

export default config;
