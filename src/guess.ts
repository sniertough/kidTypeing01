import type { KidWord } from "./words";

const keyboardNeighbors: Record<string, string> = {
  q: "wa",
  w: "qase",
  e: "wsdr",
  r: "edft",
  t: "rfgy",
  y: "tghu",
  u: "yhji",
  i: "ujko",
  o: "iklp",
  p: "ol",
  a: "qwsz",
  s: "awedxz",
  d: "serfcx",
  f: "drtgvc",
  g: "ftyhbv",
  h: "gyujnb",
  j: "huikmn",
  k: "jiolm",
  l: "kop",
  z: "asx",
  x: "zsdc",
  c: "xdfv",
  v: "cfgb",
  b: "vghn",
  n: "bhjm",
  m: "njk"
};

export type GuessResult = {
  item: KidWord;
  score: number;
};

export function cleanInput(value: string): string {
  return value.toLowerCase().replace(/[^a-z]/g, "").slice(-18);
}

function trimRepeats(value: string): string {
  return value.replace(/(.)\1{2,}/g, "$1$1");
}

function commonLetters(a: string, b: string): number {
  const count: Record<string, number> = {};
  for (const ch of a) count[ch] = (count[ch] ?? 0) + 1;
  let total = 0;
  for (const ch of b) {
    if ((count[ch] ?? 0) > 0) {
      total++;
      count[ch] -= 1;
    }
  }
  return total;
}

function keyboardBonus(input: string, target: string): number {
  let score = 0;
  const len = Math.min(input.length, target.length);
  for (let i = 0; i < len; i++) {
    if (input[i] === target[i]) score += 1;
    else if (keyboardNeighbors[target[i]]?.includes(input[i])) score += 0.45;
  }
  return score / Math.max(target.length, 1);
}

function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[a.length][b.length];
}

function scoreWord(rawInput: string, item: KidWord): number {
  const input = trimRepeats(cleanInput(rawInput));
  if (!input) return 0;

  const variants = [item.word, ...item.hints];
  let best = 0;

  for (const variant of variants) {
    const target = cleanInput(variant);
    const distance = editDistance(input, target);
    const distanceScore = 1 - distance / Math.max(input.length, target.length, 1);
    const overlapScore = commonLetters(input, target) / Math.max(target.length, 1);
    const prefixScore = target.startsWith(input) || input.startsWith(target) ? 0.28 : 0;
    const containsScore = target.includes(input) || input.includes(target) ? 0.2 : 0;
    const keyScore = keyboardBonus(input, target);
    const lengthPenalty = Math.min(Math.abs(input.length - target.length) * 0.035, 0.18);
    const priority = item.priority ?? 0;
    const score = distanceScore * 0.58 + overlapScore * 0.22 + keyScore * 0.22 + prefixScore + containsScore + priority - lengthPenalty;
    best = Math.max(best, score);
  }

  return Math.max(0, Math.min(1, best));
}

export function rankGuesses(rawInput: string, words: KidWord[]): GuessResult[] {
  return words
    .map(item => ({ item, score: scoreWord(rawInput, item) }))
    .sort((a, b) => b.score - a.score);
}

export function guessWord(rawInput: string, words: KidWord[]): GuessResult {
  const ranked = rankGuesses(rawInput, words);

  return ranked[0];
}
