# Aadhaar Semaphore

Aadhaar Semaphore is a project that integrates the Semaphore protocol with Aadhaar verification, allowing for anonymous group membership and signaling while leveraging Aadhaar for initial identity verification.

## Project Structure

The project is divided into three main components:

1. `app` - Next.js frontend application
2. `contracts` - Hardhat smart contracts
3. `subgraph` - The Graph indexing service

## Frontend (`app`)

The frontend is built using Next.js, providing a user interface for interacting with the Aadhaar Semaphore system.

To run the frontend:

```bash
cd app
yarn install
yarn dev
```

## Smart Contracts (contracts)

The smart contracts are developed and managed using Hardhat. These contracts handle the on-chain logic for group management, identity commitments, and signaling.

# Register Smart Contract

This contract manages groups and verifies proofs using Semaphore and AnonAadhaar protocols.
Deployed Register Contract Address in [0x20e104b3D87272a80f205A72741ac80ED4734c81](https://sepolia.etherscan.io/address/0x20e104b3D87272a80f205A72741ac80ED4734c81)

## Key Components

1. **Interfaces**:

   - `ISemaphore`: Interface for the Semaphore protocol
   - `IAnonAadhaar`: Interface for the AnonAadhaar protocol

2. **State Variables**:

   - `semaphore`: Instance of the Semaphore contract
   - `anonAadhaar`: Instance of the AnonAadhaar contract
   - Group IDs for different categories:
     - `above18GroupId`
     - `genderMaleGroupId`
     - `genderFemaleGroupId`

3. **Events**:
   - `GroupCreated`: Emitted when a new group is created
   - `MemberJoined`: Emitted when a member joins a group
   - `MessageSent`: Emitted when a message is sent in a group

## Key Functions

1. **Constructor**:

   - Initializes Semaphore and AnonAadhaar contracts
   - Creates groups for above 18, male, and female categories

2. **joinGroup**:

   - Allows a member to join a specified group

3. **sendMessageInAbove18Group**:

   - Sends a message in the Above18 group
   - Verifies Aadhaar proof and Semaphore proof

4. **sendMessageInMaleGroup**:

   - Sends a message in the Male Gender group
   - Verifies Aadhaar proof and Semaphore proof

5. **sendMessageInFemaleGroup**:

   - Sends a message in the Female Gender group
   - Verifies Aadhaar proof and Semaphore proof

## Usage

This contract allows users to:

1. Join specific groups based on their attributes (age, gender)
2. Send messages within these groups
3. Verify their identity using Aadhaar and maintain anonymity using Semaphore

## Note

The contract includes a TODO comment mentioning a generic `sendMessage` function that's currently causing issues with the `via-ir` flag.

```bash
cd contracts
npm install
npx hardhat test
```

## Subgraph (subgraph)

The subgraph indexes events from the smart contracts, allowing for efficient querying of on-chain data.
Deployed subgraph: https://thegraph.com/studio/subgraph/aadhargroups/
To deploy updates to the subgraph:

## Features

1. Aadhaar verification using ZK circuits
2. Anonymous group membership with Semaphore
3. Private signaling within groups
4. On-chain group management
5. Efficient data indexing and querying with The Graph
