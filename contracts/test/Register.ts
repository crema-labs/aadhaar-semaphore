import { generateProof, Group, Identity } from "@semaphore-protocol/core";
import { encodeBytes32String } from "ethers";
import { ethers } from "hardhat";
import { Register, Semaphore } from "../typechain-types";

describe("Register Contract Tests", function () {
  let register: Register;
  let semaphore: Semaphore;
  let anonAadhaarVerifier: any;
  const group = new Group();
  const users: Identity[] = [];
  const above18GroupId = 0;
  const genderMaleGroupId = 1;
  const genderFemaleGroupId = 2;

  beforeEach(async function () {
    users.push(new Identity());
    users.push(new Identity());

    // Deploy Verifier
    const VerifierFactory = await ethers.getContractFactory("Verifier");
    const verifierContract = await VerifierFactory.deploy();
    console.log("Verifier Contract:", await verifierContract.getAddress());

    // Deploy AnonAadhaar
    const pubkeyHashBigInt =
      "15134874015316324267425466444584014077184337590635665158241104437045239495873";
    const AnonAadhaarFactory = await ethers.getContractFactory("AnonAadhaar");

    anonAadhaarVerifier = await AnonAadhaarFactory.deploy(
      await verifierContract.getAddress(),
      pubkeyHashBigInt
    );
    console.log("AnonAadhaarVerifier:", await anonAadhaarVerifier.getAddress());

    // Deploy SemaphoreVerifier
    const SemaphoreVerifierFactory = await ethers.getContractFactory(
      "SemaphoreVerifier"
    );
    const semaphoreVerifier = await SemaphoreVerifierFactory.deploy();
    const semaphoreVerifierAddress = await semaphoreVerifier.getAddress();

    // Deploy PoseidonT3 (library)
    const PoseidonT3Factory = await ethers.getContractFactory("PoseidonT3");
    const poseidonT3 = await PoseidonT3Factory.deploy();
    const poseidonT3Address = await poseidonT3.getAddress();

    // Deploy Semaphore
    const SemaphoreFactory = await ethers.getContractFactory("Semaphore", {
      libraries: { PoseidonT3: poseidonT3Address },
    });
    semaphore = await SemaphoreFactory.deploy(semaphoreVerifierAddress);
    console.log("Semaphore:", await semaphore.getAddress());

    // Deploy Register
    const RegisterFactory = await ethers.getContractFactory("Register");
    register = await RegisterFactory.deploy(
      await semaphore.getAddress(),
      await anonAadhaarVerifier.getAddress()
    );
    console.log("Register:", await register.getAddress());
  });

  it("should join members in the group", async () => {
    for (const user of users) {
      group.addMember(user.commitment);
      await register.joinAbove18(user.commitment);
    }
    const message = encodeBytes32String("Hello World");
    const fullProof = await generateProof(
      users[1],
      group,
      message,
      above18GroupId
    );
    const transaction = await register.verifyAbove18Group(
      fullProof.merkleTreeDepth,
      fullProof.merkleTreeRoot,
      fullProof.nullifier,
      message,
      fullProof.points
    );
    console.log("Proof Valid:", transaction);
  });
});
