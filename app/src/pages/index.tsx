import { RegisterContract } from "@/lib/lib";
import {
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  useProver,
} from "@anon-aadhaar/react";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import {
  generateProof,
  Group,
  packGroth16Proof,
} from "@semaphore-protocol/core";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";
import { Identity } from "@semaphore-protocol/identity";
import "dotenv/config";
import { encodeBytes32String } from "ethers";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [anonAadhaar] = useAnonAadhaar();
  const [_, anonAadhaarCore] = useProver();
  const [isCreatingIdentity, setIsCreatingIdentity] = useState(true);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState([]);
  const [txHashMessage, setTxHashMessage] = useState("");
  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      console.log(anonAadhaar.status, anonAadhaarCore);
    }
    MessageQuery();
  }, [anonAadhaar, isCreatingIdentity, txHashMessage]);

  const loginMessage = () =>
    toast("Please login with your Aadhar to post a message");
  const messageSent = () => toast("Message sent successfully");

  const MessageQuery = async () => {
    const tokensQuery = gql`
      {
        messageSents {
          id
          message
          groupId
          transactionHash
        }
      }
    `;

    const client = new ApolloClient({
      uri: "https://api.studio.thegraph.com/query/67478/aadhargroups/version/latest",
      cache: new InMemoryCache(),
    });

    const res = await client.query({
      query: tokensQuery,
    });

    const decodedMessages = res.data.messageSents.map((message: any) => {
      const bigMessage = BigInt(message.message);
      const hexMessage = bigMessage.toString(16);
      let buf = Buffer.from(hexMessage, "hex");
      let data = buf.toString("utf8");
      return {
        id: message.id, // message.id is txID
        decodedMessage: data,
        groupId: message.groupId,
        txHash: message.transactionHash,
        blockTimestamp: parseInt(message.blockTimestamp),
      };
    });
    // Sort the messages by blockTimestamp in descending order (latest first)
    const sortedMessages = decodedMessages.sort(
      (a: any, b: any) => b.blockTimestamp - a.blockTimestamp
    );

    setMessages(sortedMessages.reverse());
  };

  const generateIdentityProof = async (message: string) => {
    const registerContract = new RegisterContract().contractInstance;
    const group = new Group();
    const users: Identity[] = [];
    const above18GroupId = 30;
    users.push(new Identity());
    setIsCreatingIdentity(true);

    const semaphoreSubgraph = new SemaphoreSubgraph();
    const members = await semaphoreSubgraph.getGroupMembers("30");
    group.addMembers(members);

    for (const user of users) {
      group.addMember(user.commitment);
      await registerContract.joinGroup(above18GroupId, user.commitment);
    }

    const encodedMessage = encodeBytes32String(message || "Hello World");

    const fullProof = await generateProof(
      users[0],
      group,
      encodedMessage,
      above18GroupId
    );

    return fullProof;
  };
  const generateAadharProof = async (message: string) => {
    setIsCreatingIdentity(false);
    const registerContract = new RegisterContract().contractInstance;
    console.log("Generating proof");
    try {
      const fullProof = await generateIdentityProof(message);
      if (!anonAadhaarCore) {
        loginMessage();
        throw new Error("Anon Aadhaar Core is not initialized");
      }
      const { proof } = anonAadhaarCore;

      const packedGroth16Proof = packGroth16Proof(proof.groth16Proof);
      const tx = await registerContract.sendMessageInAbove18Group(
        proof.nullifierSeed,
        proof.nullifier,
        proof.timestamp,
        1,
        [proof.ageAbove18, proof.gender, proof.pincode, proof.state],
        packedGroth16Proof,
        fullProof.merkleTreeDepth,
        fullProof.merkleTreeRoot,
        fullProof.nullifier,
        fullProof.message,
        fullProof.points,
        { gasLimit: 600000 }
      );
      console.log(tx);
      setTxHashMessage(tx.hash);
      messageSent();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center text-blue-400">
          Anon-Aadhar Semaphore Identity
        </h2>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <p className="text-lg text-gray-300 mb-4">
            Please login with your original Aadhar to post a message in the
            group.
          </p>
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

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value as any)}
            placeholder="Enter your message"
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            rows={3}
          />
          <button
            onClick={async () => {
              await generateAadharProof(message as any);
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
          >
            Send Message
          </button>
        </div>

        {txHashMessage && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 text-white">
            <p className="text-lg mb-2">Transaction sent! View on Sepolia:</p>
            <a
              href={`https://sepolia.etherscan.io/tx/${txHashMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 break-all"
            ></a>
          </div>
        )}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-blue-400">
            Age Above 18 Messages
          </h2>
          {messages.length === 0 ? (
            <p className="text-gray-400 text-lg">No messages found.</p>
          ) : (
            <ul className="space-y-6">
              {messages.map((message: any) => (
                <li key={message.id} className="bg-gray-700 p-5 rounded-lg">
                  <p className="text-lg text-gray-200 break-words">
                    {message.decodedMessage}
                  </p>
                  <p className="text-sm text-gray-400 mt-3">
                    Group ID: {message.groupId}
                  </p>
                  <p className="text-sm text-gray-400 mt-3">
                    txHash:{" "}
                    <a
                      href={`https://sepolia.etherscan.io/tx/${message.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {message.txHash}
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
