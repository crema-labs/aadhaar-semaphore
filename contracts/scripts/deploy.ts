import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment...");

  // Deploy Register.sol
  const Register = await ethers.getContractFactory("Register");
  const register = await Register.deploy(
    "0x1e0d7FF1610e480fC93BdEC510811ea2Ba6d7c2f", // Semaphore contract address
    "0xd59C20F74056080e5ac4B0f55bBd77ff75E7a16e" // AnonAadhaar contract address
  );
  console.log("Register:", await register.getAddress());
  console.log("-----------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
