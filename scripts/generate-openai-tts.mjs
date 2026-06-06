import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import OpenAI from "openai";

const words = [
  ["cat", "แมว"],
  ["dog", "หมา"],
  ["fish", "ปลา"],
  ["bird", "นก"],
  ["apple", "แอปเปิล"],
  ["banana", "กล้วย"],
  ["milk", "นม"],
  ["ball", "ลูกบอล"],
  ["car", "รถ"],
  ["house", "บ้าน"],
  ["book", "หนังสือ"],
  ["star", "ดาว"],
  ["moon", "พระจันทร์"],
  ["tree", "ต้นไม้"],
  ["sleep", "นอน"]
];

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function writeSpeech(text, outputPath, instructions) {
  const response = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "shimmer",
    input: text,
    instructions,
    response_format: "mp3"
  });

  await mkdir(dirname(outputPath), { recursive: true });
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, bytes);
  console.log(`wrote ${outputPath}`);
}

for (const [english, thai] of words) {
  await writeSpeech(
    english,
    resolve(`public/assets/audio/en/${english}.mp3`),
    "Speak like a warm preschool teacher. Very short, bright, clear pronunciation."
  );

  await writeSpeech(
    thai,
    resolve(`public/assets/audio/th/${english}.mp3`),
    "พูดเหมือนครูอนุบาลใจดี เสียงนุ่ม สดใส ชัด และสั้นมาก"
  );
}
