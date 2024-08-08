import { Contract, JsonRpcProvider, Wallet } from "ethers";
import RegisterABI from "./register.json";
import "dotenv/config";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";

export const wallet = new Wallet(
  process.env.NEXT_PUBLIC_PRIVATE_KEY ? process.env.NEXT_PUBLIC_PRIVATE_KEY : ""
);

export const provider = new JsonRpcProvider(
  "https://ethereum-sepolia.blockpi.network/v1/rpc/public"
);

export const signer = wallet.connect(provider);

export class RegisterContract {
  contractInstance: Contract;

  constructor() {
    this.contractInstance = new Contract(
      "0x9185A1c6F7Cb004DBB5883eD9cb8CBed85ab34fD",
      RegisterABI,
      signer
    );
  }

  public async addMemberToGroup(groupId: number, member: bigint) {
    await this.contractInstance.joinGroup(groupId, member);
  }

  public async getAbove18GroupId() {
    return await this.contractInstance.above18GroupId();
  }

  public async getMaleGroupId() {
    return await this.contractInstance.genderMaleGroupId();
  }

  public async getFemaleGroupId() {
    return await this.contractInstance.genderFemaleGroupId();
  }

  public async getGroupMembers(groupId: number) {
    const semaphoreSubgraph = new SemaphoreSubgraph();
    const members = await semaphoreSubgraph.getGroupMembers(groupId.toString());
    return members;
  }

  public async sendMessageInAbove18Group(
    nullifierSeed: string,
    nullifier: string,
    timestamp: string,
    signal: string,
    revealArray: string[],
    groth16Proof: string[][],
    merkleTreeDepth: number,
    merkleTreeRoot: string,
    nullifierSemaphore: string,
    message: string,
    points: string[]
  ) {
    // Ensure the correct types are passed for the array arguments
    const revealArrayFormatted = revealArray.map((value) => BigInt(value));
    const groth16ProofFormatted = groth16Proof.map((row) =>
      row.map((value) => BigInt(value))
    );

    // Call the contract method with the provided arguments
    await this.contractInstance.sendMessageInAbove18Group(
      BigInt(nullifierSeed),
      BigInt(nullifier),
      BigInt(timestamp),
      signal,
      revealArrayFormatted,
      groth16ProofFormatted,
      BigInt(merkleTreeDepth),
      BigInt(merkleTreeRoot),
      BigInt(nullifierSemaphore),
      message,
      points.map((value) => BigInt(value))
    );
  }
}
