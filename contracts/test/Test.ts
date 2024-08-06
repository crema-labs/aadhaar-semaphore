import { expect } from "chai";
import { ethers } from "hardhat";
import { Register, Semaphore, SemaphoreVerifier } from "../typechain-types";

describe("Register Contract Tests", function () {
  let register: Register;
  let semaphore: Semaphore;

  beforeEach(async function () {
    // Deploy the SemaphoreVerifier contract
    const SemaphoreVerifierFactory = await ethers.getContractFactory(
      "SemaphoreVerifier"
    );
    const semaphoreVerifier = await SemaphoreVerifierFactory.deploy();
    const semaphoreVerifierAddress = await semaphoreVerifier.getAddress();

    // Deploy the PoseidonT3 contract (library)
    const PoseidonT3Factory = await ethers.getContractFactory("PoseidonT3");
    const poseidonT3 = await PoseidonT3Factory.deploy();
    const poseidonT3Address = await poseidonT3.getAddress();

    // Deploy the Semaphore contract using the deployed PoseidonT3 library
    const SemaphoreFactory = await ethers.getContractFactory("Semaphore", {
      libraries: {
        PoseidonT3: poseidonT3Address,
      },
    });
    semaphore = await SemaphoreFactory.deploy(semaphoreVerifierAddress);
    console.log("Semaphore deployed to:", await semaphore.getAddress());

    const registerFactory = await ethers.getContractFactory("Register");
    register = await registerFactory.deploy(await semaphore.getAddress());
    console.log("Register deployed to:", await register.getAddress());
  });

  it("should pass a basic test", () => {});
});
