# Kid Typing Magic

เว็บแอปให้เด็กกดแป้นพิมพ์มั่ว ๆ แล้วเดาเป็นคำศัพท์ง่าย ๆ พร้อมเสียงและรูปประกอบ

## Run

```bash
npm install
npm run dev
```

## แนวทางเสียง

แอปจะพยายามเล่นไฟล์เสียงจาก `public/assets/audio` ก่อน ถ้าไม่มีไฟล์จะ fallback ไปใช้เสียงจาก browser

โครงไฟล์ที่แนะนำ:

```text
public/assets/audio/en/cat.mp3
public/assets/audio/th/cat.mp3
public/assets/audio/en/dog.mp3
public/assets/audio/th/dog.mp3
```

ถ้าจะ generate ด้วย OpenAI TTS:

```bash
set OPENAI_API_KEY=your_key_here
npm run generate:tts
```

เสียง AI ควรทำเป็นไฟล์ล่วงหน้า เพราะเร็วกว่า คุมคุณภาพได้ และไม่ต้องเรียก API ทุกครั้งที่เด็กเล่น

## แนวทางรูป

ใส่รูปเป็น `.webp` ใน `public/assets/images` แล้ว mapping ใน `src/words.ts`

```text
public/assets/images/cat.webp
public/assets/images/dog.webp
```

ถ้าไฟล์รูปยังไม่มี แอปจะแสดงรูป fallback ที่ `public/assets/images/missing-word.svg` ไปก่อน

## Word Bank

คำหลักที่มี asset เฉพาะอยู่ใน `src/words.ts` ส่วนคำศัพท์ชีวิตประจำวันอยู่ใน `src/expandedWords.ts`
