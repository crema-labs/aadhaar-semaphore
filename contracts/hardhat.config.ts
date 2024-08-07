import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@semaphore-protocol/hardhat";

const PRIVATE_KEY = vars.get("PRIVATE_KEY");
const config: HardhatUserConfig = {
  solidity: "0.8.23",
  dependencyCompiler: {
    paths: [
      "@anon-aadhaar/contracts/src/Verifier.sol",
      "@anon-aadhaar/contracts/src/AnonAadhaar.sol",
    ],
  },
  networks: {
    // Sepolia Testnet
    sepolia: {
      url: `https://ethereum-sepolia.blockpi.network/v1/rpc/public`,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
