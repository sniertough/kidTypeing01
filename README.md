# Kid Typing Magic

เว็บแอปให้เด็กกดแป้นพิมพ์มั่ว ๆ แล้วเดาเป็นคำศัพท์ง่าย ๆ พร้อมเสียงและรูปประกอบ

## Run

```bash
npm install
npm run dev
```

## แนวทางเสียง

แอปจะพยายามเล่นไฟล์เสียงจาก `assets/audio` ก่อน ถ้าไม่มีไฟล์จะ fallback ไปใช้เสียงจาก browser

โครงไฟล์ที่แนะนำ:

```text
assets/audio/en/cat.mp3
assets/audio/th/cat.mp3
assets/audio/en/dog.mp3
assets/audio/th/dog.mp3
```

ถ้าจะ generate ด้วย OpenAI TTS:

```bash
set OPENAI_API_KEY=your_key_here
npm run generate:tts
```

เสียง AI ควรทำเป็นไฟล์ล่วงหน้า เพราะเร็วกว่า คุมคุณภาพได้ และไม่ต้องเรียก API ทุกครั้งที่เด็กเล่น

## แนวทางรูป

ใส่รูปเป็น `.webp` ใน `assets/images` แล้ว mapping ใน `src/words.ts`

```text
assets/images/cat.webp
assets/images/dog.webp
```

ถ้าไฟล์รูปยังไม่มี แอปจะแสดง emoji fallback ไปก่อน

## Word Bank

เพิ่มคำศัพท์ได้ที่ `src/words.ts` โดยใส่ `word`, `thai`, `emoji`, `hints`, `image`, และ `audio`
