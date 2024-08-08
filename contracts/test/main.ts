import {
  Contract,
  encodeBytes32String,
  id,
  JsonRpcProvider,
  Wallet,
} from "ethers";
import RegisterABI from "./Register.json";
import {
  generateProof,
  Group,
  Identity,
  packGroth16Proof,
} from "@semaphore-protocol/core";
import { generatSampleProof } from "./utils/utils";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";
export const wallet = new Wallet(
  "3aec8034c6bcd284f2d9b8cb7f325952ae3d2454e6d2f8bca5c0a21cebb67fb9"
);

export const provider = new JsonRpcProvider(
  "https://ethereum-sepolia.blockpi.network/v1/rpc/public"
);

export const signer = wallet.connect(provider);

const contractInstance = new Contract(
  "0x20e104b3D87272a80f205A72741ac80ED4734c81",
  RegisterABI,
  signer
);
const users: Identity[] = [];
const group = new Group();
users.push(new Identity());
users.push(new Identity());

async function Sui() {
  const id1 = new Identity();
  const semaphoreSubgraph = new SemaphoreSubgraph();
  const groupMembers = await semaphoreSubgraph.getGroupMembers("25");

  const user = users[0];
  await contractInstance.joinGroup(25, id1.commitment);

  const group = new Group(groupMembers);
  group.addMember(id1.commitment);
  const message = encodeBytes32String("Hello World");
  const proofSemaphore = await generateProof(id1, group, message, 25);
  //   console.log(proofSemaphore);
  const { proof, user1addres } = await generatSampleProof();
  //   const packedGroth16Proof = packGroth16Proof(proof.groth16Proof);

  //   const tx = await contractInstance.sendMessageInAbove18Group(
  //     // above18GroupId,
  //     proof.nullifierSeed, // string
  //     proof.nullifier,
  //     proof.timestamp,
  //     user1addres,
  //     [proof.ageAbove18, proof.gender, proof.pincode, proof.state],
  //     packedGroth16Proof,

  //     // ARGS
  //     proofSemaphore.merkleTreeDepth,
  //     proofSemaphore.merkleTreeRoot,
  //     proofSemaphore.nullifier,
  //     message,
  //     proofSemaphore.points,
  //     {
  //       gasLimit: 300000, // Increase this value as needed
  //     }
  //   );
  //   console.log(tx);
}

Sui();
