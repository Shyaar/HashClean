// lib/generateRandomName.ts
import { keccak256, toBytes } from "viem";

const ADJECTIVES = [
  "Calm",
  "Quiet",
  "Gentle",
  "Brave",
  "Kind",
  "Bright",
  "Soft",
  "Steady",
  "True",
  "Bold",
  "Mellow",
  "Warm",
  "Humble",
  "Hope",
  "Still",
  "Clear",
];

const NOUNS = [
  "Willow",
  "River",
  "Dove",
  "Otter",
  "Stone",
  "Harbor",
  "Meadow",
  "Cedar",
  "Haven",
  "Beacon",
  "Fern",
  "Sparrow",
  "Sage",
  "Horizon",
  "Marigold",
  "Brook",
];

export default function generateRandomNameFromAddress(address: string) {
  const hash = keccak256(toBytes(address));
  const hashNum = BigInt(hash);

  const adjIdx = Number(hashNum % BigInt(ADJECTIVES.length));

  const nounIdx = Number(
    (hashNum / BigInt(ADJECTIVES.length)) % BigInt(NOUNS.length)
  );

  const num = Number(
    (hashNum / BigInt(ADJECTIVES.length * NOUNS.length)) % 100n
  );

  console.log(`${ADJECTIVES[adjIdx]}${NOUNS[nounIdx]}${num}`);
  return `${ADJECTIVES[adjIdx]}${NOUNS[nounIdx]}${num}`;
}

