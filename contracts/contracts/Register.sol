//SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@anon-aadhaar/contracts/interfaces/IAnonAadhaar.sol";
import "hardhat/console.sol";

contract Register {
    ISemaphore public semaphore;
    IAnonAadhaar public anonAadhaar;
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

    function joinAbove18(uint256 identityCommitment) external {
        semaphore.addMember(above18GroupId, identityCommitment);
    }

    function joinGenderMale(uint256 identityCommitment) external {
        semaphore.addMember(genderMaleGroupId, identityCommitment);
    }

    function joinGenderFemale(uint256 identityCommitment) external {
        semaphore.addMember(genderFemaleGroupId, identityCommitment);
    }

    function sendMessageinAbove18(
        uint nullifierSeed,
        uint nullifier,
        uint timestamp,
        uint signal,
        uint[4] calldata revealArray,
        uint[8] calldata groth16Proof,
        // -----------------------------
        // ! Semaphore args

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
            "Register: Invalid proof"
        );

        require(
            verifyAbove18Group(
                merkleTreeDepth,
                merkleTreeRoot,
                nullifierSemaphore,
                message,
                points
            ),
            "Semaphore proof is not valid"
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

    function verifyAbove18Group(
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256 nullifier,
        uint256 message,
        uint256[8] calldata points
    ) internal view returns (bool) {
        ISemaphore.SemaphoreProof memory proof = ISemaphore.SemaphoreProof(
            merkleTreeDepth,
            merkleTreeRoot,
            nullifier,
            message,
            above18GroupId,
            points
        );

        return semaphore.verifyProof(above18GroupId, proof);
    }
}
