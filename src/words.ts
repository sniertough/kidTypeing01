export type LanguageCode = "en" | "th";

export type KidWord = {
  word: string;
  thai: string;
  emoji: string;
  hints: string[];
  image?: string;
  audio?: Partial<Record<LanguageCode, string>>;
  imagePrompt: string;
};

const asset = (folder: "audio" | "images", file: string) => `/assets/${folder}/${file}`;

export const WORDS: KidWord[] = [
  {
    word: "cat",
    thai: "แมว",
    emoji: "🐱",
    hints: ["cta", "kat", "ca", "ct", "gat"],
    image: asset("images", "cat.webp"),
    audio: { en: asset("audio", "en/cat.mp3"), th: asset("audio", "th/cat.mp3") },
    imagePrompt: "cute toy-like kitten, bright children flashcard style, isolated on transparent background"
  },
  {
    word: "dog",
    thai: "หมา",
    emoji: "🐶",
    hints: ["god", "do", "dg", "dag"],
    image: asset("images", "dog.webp"),
    audio: { en: asset("audio", "en/dog.mp3"), th: asset("audio", "th/dog.mp3") },
    imagePrompt: "friendly puppy, rounded 3d toy style, bright children flashcard, transparent background"
  },
  {
    word: "fish",
    thai: "ปลา",
    emoji: "🐟",
    hints: ["fsh", "fis", "fhis", "dish"],
    image: asset("images", "fish.webp"),
    audio: { en: asset("audio", "en/fish.mp3"), th: asset("audio", "th/fish.mp3") },
    imagePrompt: "happy colorful fish, simple child-friendly illustration, transparent background"
  },
  {
    word: "bird",
    thai: "นก",
    emoji: "🐦",
    hints: ["brd", "bir", "birs", "bord"],
    image: asset("images", "bird.webp"),
    audio: { en: asset("audio", "en/bird.mp3"), th: asset("audio", "th/bird.mp3") },
    imagePrompt: "small cheerful bird, bright soft 3d icon, transparent background"
  },
  {
    word: "apple",
    thai: "แอปเปิล",
    emoji: "🍎",
    hints: ["aple", "appel", "apl"],
    image: asset("images", "apple.webp"),
    audio: { en: asset("audio", "en/apple.mp3"), th: asset("audio", "th/apple.mp3") },
    imagePrompt: "shiny red apple, soft toy-like 3d icon, transparent background"
  },
  {
    word: "banana",
    thai: "กล้วย",
    emoji: "🍌",
    hints: ["banan", "bana", "bananaaa"],
    image: asset("images", "banana.webp"),
    audio: { en: asset("audio", "en/banana.mp3"), th: asset("audio", "th/banana.mp3") },
    imagePrompt: "cute banana, bright children flashcard style, transparent background"
  },
  {
    word: "milk",
    thai: "นม",
    emoji: "🥛",
    hints: ["mil", "mik", "mlk"],
    image: asset("images", "milk.webp"),
    audio: { en: asset("audio", "en/milk.mp3"), th: asset("audio", "th/milk.mp3") },
    imagePrompt: "small glass of milk, soft 3d toy icon, transparent background"
  },
  {
    word: "ball",
    thai: "ลูกบอล",
    emoji: "⚽",
    hints: ["bal", "bll", "boll"],
    image: asset("images", "ball.webp"),
    audio: { en: asset("audio", "en/ball.mp3"), th: asset("audio", "th/ball.mp3") },
    imagePrompt: "colorful child play ball, soft 3d toy style, transparent background"
  },
  {
    word: "car",
    thai: "รถ",
    emoji: "🚗",
    hints: ["cr", "kar", "cart"],
    image: asset("images", "car.webp"),
    audio: { en: asset("audio", "en/car.mp3"), th: asset("audio", "th/car.mp3") },
    imagePrompt: "small red toy car, rounded 3d icon, transparent background"
  },
  {
    word: "house",
    thai: "บ้าน",
    emoji: "🏠",
    hints: ["hous", "hose", "home"],
    image: asset("images", "house.webp"),
    audio: { en: asset("audio", "en/house.mp3"), th: asset("audio", "th/house.mp3") },
    imagePrompt: "cozy small house, toy-like children illustration, transparent background"
  },
  {
    word: "book",
    thai: "หนังสือ",
    emoji: "📚",
    hints: ["bok", "boo", "boook"],
    image: asset("images", "book.webp"),
    audio: { en: asset("audio", "en/book.mp3"), th: asset("audio", "th/book.mp3") },
    imagePrompt: "open colorful picture book, child-friendly 3d icon, transparent background"
  },
  {
    word: "star",
    thai: "ดาว",
    emoji: "⭐",
    hints: ["str", "sta", "tar"],
    image: asset("images", "star.webp"),
    audio: { en: asset("audio", "en/star.mp3"), th: asset("audio", "th/star.mp3") },
    imagePrompt: "happy golden star, plush toy-like icon, transparent background"
  },
  {
    word: "moon",
    thai: "พระจันทร์",
    emoji: "🌙",
    hints: ["mon", "moo", "mn"],
    image: asset("images", "moon.webp"),
    audio: { en: asset("audio", "en/moon.mp3"), th: asset("audio", "th/moon.mp3") },
    imagePrompt: "gentle crescent moon, soft bedtime children icon, transparent background"
  },
  {
    word: "tree",
    thai: "ต้นไม้",
    emoji: "🌳",
    hints: ["tre", "tee", "free"],
    image: asset("images", "tree.webp"),
    audio: { en: asset("audio", "en/tree.mp3"), th: asset("audio", "th/tree.mp3") },
    imagePrompt: "friendly green tree, rounded toy-like 3d icon, transparent background"
  },
  {
    word: "sleep",
    thai: "นอน",
    emoji: "😴",
    hints: ["slep", "slp", "seep"],
    image: asset("images", "sleep.webp"),
    audio: { en: asset("audio", "en/sleep.mp3"), th: asset("audio", "th/sleep.mp3") },
    imagePrompt: "sleepy child-friendly bedtime symbol, soft 3d icon, transparent background"
  }
];
