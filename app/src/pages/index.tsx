import { RegisterContract, signer } from "@/lib/lib";
import {
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  useProver,
} from "@anon-aadhaar/react";
import {
  generateProof,
  Group,
  packGroth16Proof,
} from "@semaphore-protocol/core";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";
import { Identity } from "@semaphore-protocol/identity";
import "dotenv/config";
import { useEffect, useState } from "react";
import AadharProofJson from "../../proof.json";
import { Contract, encodeBytes32String } from "ethers";
import RegisterABI from "../lib/register.json";

type HomeProps = {
  setUseTestAadhaar: (state: boolean) => void;
  useTestAadhaar: boolean;
};

export default function Home({ setUseTestAadhaar, useTestAadhaar }: HomeProps) {
  // Use the Country Identity hook to get the status of the user.
  const [anonAadhaar] = useAnonAadhaar();
  const [latestProof] = useProver();
  const [commitment, setCommitment] = useState("");
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      console.log(anonAadhaar.status, latestProof);
    }
  }, [anonAadhaar]);

  const switchAadhaar = () => {
    setUseTestAadhaar(!useTestAadhaar);
  };

  // TODO we can use HASH(PUBLIC_KEY) as the identity
  const createIdentity = async () => {
    console.log("here ..... ");
    const id1 = new Identity();
    const semaphoreSubgraph = new SemaphoreSubgraph();
    const groupMembers = await semaphoreSubgraph.getGroupMembers("25");

    const registerContract = new RegisterContract();
    await registerContract.addMemberToGroup(25, id1.commitment);

    const group = new Group(groupMembers);
    group.addMember(id1.commitment);
    const message = encodeBytes32String("Hello World");
    const proofSemaphore = await generateProof(id1, group, message, 25);
    const { proof, user1addres } = AadharProofJson;

    const packedGroth16Proof = packGroth16Proof(proof.groth16Proof);

    const c = new Contract(
      "0x9185A1c6F7Cb004DBB5883eD9cb8CBed85ab34fD",
      RegisterABI,
      signer
    );

    const tx = await c.sendMessageInAbove18Group(
      // above18GroupId,
      proof.nullifierSeed, // string
      proof.nullifier,
      proof.timestamp,
      user1addres,
      [proof.ageAbove18, proof.gender, proof.pincode, proof.state],
      packedGroth16Proof,

      // ARGS
      proofSemaphore.merkleTreeDepth,
      proofSemaphore.merkleTreeRoot,
      proofSemaphore.nullifier,
      message,
      proofSemaphore.points,
      {
        gasLimit: 300000, // Increase this value as needed
      }
    );

    console.log(tx);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-4">
          Create New Semaphore Identity
        </h2>
        <button
          onClick={createIdentity}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create an Identity
        </button>
        <LogInWithAnonAadhaar
          nullifierSeed={0}
          fieldsToReveal={[
            "revealAgeAbove18",
            "revealGender",
            "revealPinCode",
            "revealState",
          ]}
        />
      </div>
    </div>
  );
}
