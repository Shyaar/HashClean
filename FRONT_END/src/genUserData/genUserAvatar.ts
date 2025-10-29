// lib/generateAvatar.ts
import { keccak256, toBytes } from "viem";

export default function generateAvatarFromAddress(address: string): string {

  const hash = keccak256(toBytes(address));
  const seed = hash.slice(2, 10);


  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${seed}`;
}
