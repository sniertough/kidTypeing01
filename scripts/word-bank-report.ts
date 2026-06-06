import { buildLetterBucket } from "../src/letterBuckets";
import { CORE_WORDS, WORDS } from "../src/words";
import { buildExpandedWords } from "../src/expandedWords";

const letters = "abcdefghijklmnopqrstuvwxyz".split("");
const bucketCounts = Object.fromEntries(
  letters.map(letter => [letter, buildLetterBucket(letter, WORDS).length])
);

const tooSmall = Object.entries(bucketCounts).filter(([, count]) => count < 5);

const report = {
  core: CORE_WORDS.length,
  expandedRaw: buildExpandedWords().length,
  mergedDeduped: WORDS.length,
  bucketCounts,
  minimumBucketSize: Math.min(...Object.values(bucketCounts)),
  failingLetters: tooSmall.map(([letter, count]) => `${letter}:${count}`)
};

console.log(JSON.stringify(report, null, 2));

if (WORDS.length < 1000) {
  throw new Error(`Word bank has ${WORDS.length} words, expected at least 1000.`);
}

if (tooSmall.length > 0) {
  throw new Error(`Some letter buckets have fewer than 5 words: ${report.failingLetters.join(", ")}`);
}
