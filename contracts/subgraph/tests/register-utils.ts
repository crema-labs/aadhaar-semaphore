import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt } from "@graphprotocol/graph-ts"
import {
  GroupCreated,
  MemberJoined,
  MessageSent
} from "../generated/Register/Register"

export function createGroupCreatedEvent(
  groupId: BigInt,
  groupName: string
): GroupCreated {
  let groupCreatedEvent = changetype<GroupCreated>(newMockEvent())

  groupCreatedEvent.parameters = new Array()

  groupCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "groupId",
      ethereum.Value.fromUnsignedBigInt(groupId)
    )
  )
  groupCreatedEvent.parameters.push(
    new ethereum.EventParam("groupName", ethereum.Value.fromString(groupName))
  )

  return groupCreatedEvent
}

export function createMemberJoinedEvent(
  groupId: BigInt,
  identityCommitment: BigInt
): MemberJoined {
  let memberJoinedEvent = changetype<MemberJoined>(newMockEvent())

  memberJoinedEvent.parameters = new Array()

  memberJoinedEvent.parameters.push(
    new ethereum.EventParam(
      "groupId",
      ethereum.Value.fromUnsignedBigInt(groupId)
    )
  )
  memberJoinedEvent.parameters.push(
    new ethereum.EventParam(
      "identityCommitment",
      ethereum.Value.fromUnsignedBigInt(identityCommitment)
    )
  )

  return memberJoinedEvent
}

export function createMessageSentEvent(
  groupId: BigInt,
  message: BigInt
): MessageSent {
  let messageSentEvent = changetype<MessageSent>(newMockEvent())

  messageSentEvent.parameters = new Array()

  messageSentEvent.parameters.push(
    new ethereum.EventParam(
      "groupId",
      ethereum.Value.fromUnsignedBigInt(groupId)
    )
  )
  messageSentEvent.parameters.push(
    new ethereum.EventParam(
      "message",
      ethereum.Value.fromUnsignedBigInt(message)
    )
  )

  return messageSentEvent
}
