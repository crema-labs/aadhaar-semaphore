//SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "hardhat/console.sol";

contract Register {
    ISemaphore public semaphore;
    uint256 public groupId;
    uint256 public above18GroupId;
    uint256 public genderMaleGroupId;
    uint256 public genderFemaleGroupId;

    constructor(address semaphoreAddress) {
        semaphore = ISemaphore(semaphoreAddress);
        groupId = semaphore.createGroup(address(this));

        above18GroupId = semaphore.createGroup(address(this));
        genderMaleGroupId = semaphore.createGroup(address(this));
        genderFemaleGroupId = semaphore.createGroup(address(this));
    }

    function joinAbove18(uint256 identityCommitment) external {
        semaphore.addMember(above18GroupId, identityCommitment);
    }

    function joinGroup(uint256 identityCommitment) external {
        semaphore.addMember(groupId, identityCommitment);
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

    function sendFeedback(
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256 nullifier,
        uint256 feedback, // it can be message, rating as well
        uint256[8] calldata points
    ) external {
        ISemaphore.SemaphoreProof memory proof = ISemaphore.SemaphoreProof(
            merkleTreeDepth,
            merkleTreeRoot,
            nullifier,
            feedback,
            groupId,
            points
        );

        semaphore.validateProof(groupId, proof);
    }

    function joinGenderMale(uint256 identityCommitment) external {
        semaphore.addMember(genderMaleGroupId, identityCommitment);
    }

    function joinGenderFemale(uint256 identityCommitment) external {
        semaphore.addMember(genderFemaleGroupId, identityCommitment);
    }
}
