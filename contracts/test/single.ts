import { Group, Identity } from "@semaphore-protocol/core";
import { Contract, JsonRpcProvider, Wallet } from "ethers";
import RegisterABI from "./aadharAbi.json";
import { generatSampleProof } from "./utils/utils";
export const wallet = new Wallet(
  "3aec8034c6bcd284f2d9b8cb7f325952ae3d2454e6d2f8bca5c0a21cebb67fb9"
);

export const provider = new JsonRpcProvider(
  "https://ethereum-sepolia.blockpi.network/v1/rpc/public"
);

export const signer = wallet.connect(provider);

const contractInstance = new Contract(
  "0x6bE8Cec7a06BA19c39ef328e8c8940cEfeF7E281",
  RegisterABI.abi,
  provider
);
const users: Identity[] = [];
const group = new Group();
users.push(new Identity());
users.push(new Identity());

async function Sui() {
  const { proof, user1addres } = await generatSampleProof();
  console.log(proof, user1addres);
  console.log(":asds");
  //   const packedGroth16Proof = packGroth16Proof(proof.groth16Proof);

  //   const tx = await contractInstance.verifyAnonAadhaarProof(
  //     // above18GroupId,
  //     proof.nullifierSeed, // string
  //     proof.nullifier,
  //     proof.timestamp,
  //     user1addres,
  //     [proof.ageAbove18, proof.gender, proof.pincode, proof.state],
  //     packedGroth16Proof

  //     // // ARGS
  //     // proofSemaphore.merkleTreeDepth,
  //     // proofSemaphore.merkleTreeRoot,
  //     // proofSemaphore.nullifier,
  //     // message,
  //     // proofSemaphore.points,
  //     // {
  //     //   gasLimit: 300000, // Increase this value as needed
  //     // }
  //   );
  //   console.log(tx);
}

Sui();
