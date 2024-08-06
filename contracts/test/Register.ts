import { ethers } from "hardhat";
import { Register, Semaphore } from "../typechain-types";
import { generateProof, Group, Identity } from "@semaphore-protocol/core";
import { encodeBytes32String } from "ethers";

describe("Register Contract Tests", function () {
  let register: Register;
  let semaphore: Semaphore;
  const group = new Group();
  const users: Identity[] = [];
  const above18GroupId = 0;
  const genderMaleGroupId = 1;
  const genderFemaleGroupId = 2;

  beforeEach(async function () {
    users.push(new Identity());
    users.push(new Identity());

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

  it("should join members in the group", async () => {
    for await (const [_, user] of users.entries()) {
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
    console.log("Proof Valid or not", transaction);
  });
});
