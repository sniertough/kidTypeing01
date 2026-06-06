import type { KidWord } from "./words";

const commonByLetter: Record<string, string[]> = {
  a: ["apple", "arm", "ant", "airplane", "ambulance"],
  b: ["ball", "baby", "book", "banana", "bag", "bed", "bird", "bus"],
  c: ["cat", "car", "cup", "cake", "chair", "cloud", "cow", "cookie"],
  d: ["dog", "dad", "duck", "door", "doll", "doctor", "dance", "drink"],
  e: ["egg", "eye", "ear", "elephant", "eraser", "eat"],
  f: ["fish", "foot", "friend", "family", "flower", "frog", "fork"],
  g: ["girl", "grape", "green", "grandma", "grandpa", "goat"],
  h: ["hand", "hat", "house", "home", "hair", "heart", "hug", "happy"],
  i: ["ice cream", "ice", "insect", "inside", "igloo", "island"],
  j: ["juice", "jump", "jacket", "jam", "jelly", "jar"],
  k: ["kid", "key", "kite", "kitchen", "knee"],
  l: ["leg", "lamp", "leaf", "lion", "lemon", "light"],
  m: ["mom", "milk", "moon", "mouth", "mango", "mouse", "market"],
  n: ["nose", "nurse", "noodle"],
  o: ["orange", "open", "out", "owl", "octopus", "ocean"],
  p: ["pig", "pen", "pencil", "paper", "pillow", "park", "plane"],
  q: ["queen", "quack", "quiet", "quilt", "question", "quick"],
  r: ["rabbit", "rain", "rice", "road", "rocket", "read", "run", "red"],
  s: ["sun", "shoe", "sock", "shirt", "sister", "school", "sleep", "spoon"],
  t: ["tree", "toy", "train", "table", "teacher", "tiger", "towel", "tooth"],
  u: ["up", "under", "umbrella", "uncle", "unicorn", "upstairs"],
  v: ["van", "vase", "violin", "vest", "vegetable", "volcano"],
  w: ["water", "window", "wash", "walk", "wave", "wind", "white"],
  x: ["x-ray", "xylophone", "box", "fox", "six", "mix"],
  y: ["yes", "yellow", "yogurt", "yawn", "yard"],
  z: ["zebra", "zoo", "zero", "zipper", "zigzag"]
};

const cleanWord = (value: string) => value.toLowerCase().replace(/[^a-z]/g, "");

export function isSingleLetterMode(input: string) {
  const clean = cleanWord(input);
  if (!clean) return false;
  return new Set(clean).size === 1;
}

export function buildLetterBucket(letter: string, words: KidWord[]) {
  const firstLetter = cleanWord(letter)[0];
  if (!firstLetter) return [];

  const byClean = new Map(words.map(item => [cleanWord(item.word), item]));
  const preferred = (commonByLetter[firstLetter] ?? [])
    .map(word => byClean.get(cleanWord(word)))
    .filter((item): item is KidWord => Boolean(item));

  const preferredKeys = new Set(preferred.map(item => cleanWord(item.word)));
  const fallback = words.filter(item => {
    const key = cleanWord(item.word);
    return key.startsWith(firstLetter) && !preferredKeys.has(key);
  });

  return [...preferred, ...fallback];
}
