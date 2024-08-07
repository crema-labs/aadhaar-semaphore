import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment...");

  // Deploy Verifier
  const Verifier = await ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();

  // Deploy AnonAadhaar
  const pubkeyHashBigInt =
    "15134874015316324267425466444584014077184337590635665158241104437045239495873";
  const AnonAadhaar = await ethers.getContractFactory("AnonAadhaar");
  const anonAadhaar = await AnonAadhaar.deploy(
    await verifier.getAddress(),
    pubkeyHashBigInt
  );

  // Deploy SemaphoreVerifier
  const SemaphoreVerifier = await ethers.getContractFactory(
    "SemaphoreVerifier"
  );
  const semaphoreVerifier = await SemaphoreVerifier.deploy();

  console.log(
    "SemaphoreVerifier deployed to:",
    await semaphoreVerifier.getAddress()
  );

  // Deploy PoseidonT3
  const PoseidonT3 = await ethers.getContractFactory("PoseidonT3");
  const poseidonT3 = await PoseidonT3.deploy();

  // Deploy Semaphore
  const Semaphore = await ethers.getContractFactory("Semaphore", {
    libraries: { PoseidonT3: await poseidonT3.getAddress() },
  });

  const semaphore = await Semaphore.deploy(
    await semaphoreVerifier.getAddress()
  );

  // Deploy Register
  const Register = await ethers.getContractFactory("Register");
  const register = await Register.deploy(
    await semaphore.getAddress(),
    await anonAadhaar.getAddress()
  );

  console.log("Deployment completed!");

  // Log all deployed addresses
  console.log("\nDeployed Contract Addresses:");
  console.log("-----------------------------");
  console.log("Verifier:", await verifier.getAddress());
  console.log("AnonAadhaar:", await anonAadhaar.getAddress());
  console.log("SemaphoreVerifier:", await semaphoreVerifier.getAddress());
  console.log("PoseidonT3:", await poseidonT3.getAddress());
  console.log("Semaphore:", await semaphore.getAddress());
  console.log("Register:", await register.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
