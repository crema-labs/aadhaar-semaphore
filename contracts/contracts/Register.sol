//SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@anon-aadhaar/contracts/interfaces/IAnonAadhaar.sol";
import "hardhat/console.sol";

/// @title Register
/// @notice A contract for managing groups and verifying proofs using Semaphore and AnonAadhaar
contract Register {
    ISemaphore public semaphore;
    IAnonAadhaar public anonAadhaar;

    // Group IDs for different categories
    uint256 public above18GroupId;
    uint256 public genderMaleGroupId;
    uint256 public genderFemaleGroupId;

    constructor(address semaphoreAddress, address anonAadharAddress) {
        semaphore = ISemaphore(semaphoreAddress);
        anonAadhaar = IAnonAadhaar(anonAadharAddress);
        above18GroupId = semaphore.createGroup(address(this));
        genderMaleGroupId = semaphore.createGroup(address(this));
        genderFemaleGroupId = semaphore.createGroup(address(this));
    }

    function joinGroup(uint256 groupId, uint256 identityCommitment) external {
        semaphore.addMember(groupId, identityCommitment);
    }

    // TODO sendMessageGenernic Function but it created via-ir flag problem

    /// @notice Sends a message in the Above18 group
    function sendMessageInAbove18Group(
        uint nullifierSeed,
        uint nullifier,
        uint timestamp,
        uint signal,
        uint[4] calldata revealArray,
        uint[8] calldata groth16Proof,
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256 nullifierSemaphore,
        uint256 message,
        uint256[8] calldata points
    ) external view {
        require(revealArray[0] == 1, "Register: Age should be above 18");

        require(
            verifyAadharProof(
                nullifierSeed,
                nullifier,
                timestamp,
                signal,
                revealArray,
                groth16Proof
            ),
            "Register: Invalid Aadhaar proof"
        );

        require(
            verifySemaphoreProof(
                above18GroupId,
                merkleTreeDepth,
                merkleTreeRoot,
                nullifierSemaphore,
                message,
                points
            ),
            "Register: Invalid Semaphore proof"
        );
    }

    /// @notice Sends a message in the Male Gender group
    function sendMessageInMaleGroup(
        uint nullifierSeed,
        uint nullifier,
        uint timestamp,
        uint signal,
        uint[4] calldata revealArray,
        uint[8] calldata groth16Proof,
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256 nullifierSemaphore,
        uint256 message,
        uint256[8] calldata points
    ) external view {
        require(revealArray[1] == 1, "Register: Gender should be male");

        require(
            verifyAadharProof(
                nullifierSeed,
                nullifier,
                timestamp,
                signal,
                revealArray,
                groth16Proof
            ),
            "Register: Invalid Aadhaar proof"
        );

        require(
            verifySemaphoreProof(
                genderMaleGroupId,
                merkleTreeDepth,
                merkleTreeRoot,
                nullifierSemaphore,
                message,
                points
            ),
            "Register: Invalid Semaphore proof"
        );
    }

    /// @notice Sends a message in the Female Gender group
    function sendMessageInFemaleGroup(
        uint nullifierSeed,
        uint nullifier,
        uint timestamp,
        uint signal,
        uint[4] calldata revealArray,
        uint[8] calldata groth16Proof,
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256 nullifierSemaphore,
        uint256 message,
        uint256[8] calldata points
    ) external view {
        require(revealArray[1] == 2, "Register: Gender should be female");

        require(
            verifyAadharProof(
                nullifierSeed,
                nullifier,
                timestamp,
                signal,
                revealArray,
                groth16Proof
            ),
            "Register: Invalid Aadhaar proof"
        );

        require(
            verifySemaphoreProof(
                genderFemaleGroupId,
                merkleTreeDepth,
                merkleTreeRoot,
                nullifierSemaphore,
                message,
                points
            ),
            "Register: Invalid Semaphore proof"
        );
    }

    function verifyAadharProof(
        uint nullifierSeed,
        uint nullifier,
        uint timestamp,
        uint signal,
        uint[4] calldata revealArray,
        uint[8] calldata groth16Proof
    ) internal view returns (bool) {
        return
            anonAadhaar.verifyAnonAadhaarProof(
                nullifierSeed,
                nullifier,
                timestamp,
                signal,
                revealArray,
                groth16Proof
            );
    }

    function verifySemaphoreProof(
        uint256 groupId,
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256 nullifier,
        uint256 message,
        uint256[8] calldata points
    ) internal view returns (bool) {
        return
            semaphore.verifyProof(
                groupId,
                ISemaphore.SemaphoreProof(
                    merkleTreeDepth,
                    merkleTreeRoot,
                    nullifier,
                    message,
                    groupId,
                    points
                )
            );
    }
}
