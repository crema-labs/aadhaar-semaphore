import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";

const id1 = new Identity();
const id2 = new Identity();
const id3 = new Identity();

const commitments = [id1.commitment, id2.commitment, id3.commitment, id1.commitment, id2.commitment, id3.commitment];
console.log(commitments);
const group1 = new Group(commitments);

console.log(group1.root);
