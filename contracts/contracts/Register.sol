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

    function verifyAadharProof(
        uint nullifierSeed,
        uint nullifier,
        uint timestamp,
        uint signal,
        uint[4] calldata revealArray,
        uint[8] calldata groth16Proof
    ) external view returns (bool) {
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
    ) external view returns (bool) {
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
