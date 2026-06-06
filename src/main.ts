import "./styles.css";
import { AudioEngine } from "./audio";
import { cleanInput, guessWord } from "./guess";
import { WORDS, type KidWord, type LanguageCode } from "./words";

const typingPad = document.querySelector<HTMLDivElement>("#typingPad")!;
const spotlight = document.querySelector<HTMLDivElement>("#spotlight")!;
const wordImage = document.querySelector<HTMLImageElement>("#wordImage")!;
const emojiFallback = document.querySelector<HTMLDivElement>("#emojiFallback")!;
const guessedWord = document.querySelector<HTMLHeadingElement>("#guessedWord")!;
const scoreBadge = document.querySelector<HTMLSpanElement>("#scoreBadge")!;
const thaiMeaning = document.querySelector<HTMLParagraphElement>("#thaiMeaning")!;
const liveBuffer = document.querySelector<HTMLElement>("#liveBuffer")!;
const history = document.querySelector<HTMLDivElement>("#history")!;
const historyCount = document.querySelector<HTMLSpanElement>("#historyCount")!;
const wordTotal = document.querySelector<HTMLSpanElement>("#wordTotal")!;
const wordSplash = document.querySelector<HTMLDivElement>("#wordSplash")!;
const splashEmoji = document.querySelector<HTMLDivElement>("#splashEmoji")!;
const splashWord = document.querySelector<HTMLDivElement>("#splashWord")!;
const splashMeaning = document.querySelector<HTMLDivElement>("#splashMeaning")!;
const voiceModeButton = document.querySelector<HTMLButtonElement>("#voiceMode")!;
const soundFxButton = document.querySelector<HTMLButtonElement>("#soundFx")!;
const languageSelect = document.querySelector<HTMLSelectElement>("#language")!;
const sayAgainButton = document.querySelector<HTMLButtonElement>("#sayAgain")!;
const clearPadButton = document.querySelector<HTMLButtonElement>("#clearPad")!;
const fullscreenButton = document.querySelector<HTMLButtonElement>("#fullscreen")!;

let buffer = "";
let idleTimer = 0;
let lastResult = WORDS[0];
let historyItems: KidWord[] = [];
let useAssetVoice = true;
let useSoundFx = true;
let spotTimer = 0;
let splashTimer = 0;

const missingImage = "/assets/images/missing-word.svg";

const audio = new AudioEngine(
  () => languageSelect.value as LanguageCode,
  () => useAssetVoice ? "asset" : "browser"
);

const colors = ["#42d6a4", "#ffd166", "#5aa9ff", "#ff6b6b", "#d7a6ff", "#7be0ff", "#ffffff"];

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function showSpot(ch: string, color: string) {
  spotlight.textContent = ch.toUpperCase();
  spotlight.style.color = color;
  spotlight.classList.add("show");
  window.clearTimeout(spotTimer);
  spotTimer = window.setTimeout(() => spotlight.classList.remove("show"), 130);
}

function burst() {
  for (let i = 0; i < 24; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.background = randomColor();
    piece.style.left = "50%";
    piece.style.top = "45%";
    document.body.appendChild(piece);

    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 9;
    const rotate = Math.random() * 520 - 260;
    let frame = 0;

    const tick = () => {
      frame += 1;
      const fade = 1 - frame / 34;
      piece.style.opacity = String(Math.max(0, fade));
      piece.style.transform = `translate(${Math.cos(angle) * speed * frame}px, ${Math.sin(angle) * speed * frame + frame * 1.6}px) rotate(${rotate * frame / 34}deg)`;
      if (frame < 34) requestAnimationFrame(tick);
      else piece.remove();
    };

    requestAnimationFrame(tick);
  }
}

function addTypedCharacter(ch: string) {
  const color = randomColor();
  const span = document.createElement("span");
  span.className = ch === " " ? "space" : "typed-letter";
  span.textContent = ch;
  span.style.color = color;
  typingPad.appendChild(span);
  typingPad.scrollTop = typingPad.scrollHeight;

  if (ch !== " ") showSpot(ch, color);
  audio.playKey(ch, useSoundFx);
}

function showImage(item: KidWord) {
  emojiFallback.textContent = item.emoji;
  emojiFallback.classList.remove("bounce");
  wordImage.classList.remove("bounce");
  void emojiFallback.offsetWidth;

  if (!item.image) {
    wordImage.hidden = false;
    emojiFallback.hidden = true;
    wordImage.src = missingImage;
    wordImage.alt = "ยังไม่มีรูปสำหรับคำนี้";
    wordImage.classList.add("bounce");
    return;
  }

  wordImage.hidden = false;
  emojiFallback.hidden = true;
  wordImage.src = item.image;
  wordImage.alt = item.thai;
  wordImage.onload = () => wordImage.classList.add("bounce");
  wordImage.onerror = () => {
    wordImage.src = missingImage;
    wordImage.alt = "ยังไม่มีรูปสำหรับคำนี้";
    wordImage.classList.add("bounce");
  };
}

function showSplash(item: KidWord) {
  splashEmoji.textContent = item.emoji;
  splashWord.textContent = item.word;
  splashMeaning.textContent = item.image ? item.thai : `${item.thai} · ยังไม่มีรูป/เสียง AI`;

  wordSplash.classList.remove("play");
  void wordSplash.offsetWidth;
  wordSplash.classList.add("play");

  window.clearTimeout(splashTimer);
  splashTimer = window.setTimeout(() => wordSplash.classList.remove("play"), 1200);
}

function renderHistory() {
  historyCount.textContent = String(historyItems.length);
  history.innerHTML = "";

  for (const item of historyItems) {
    const button = document.createElement("button");
    button.className = "history-item";
    button.type = "button";
    button.innerHTML = `<span aria-hidden="true">${item.emoji}</span><strong>${item.word}</strong>`;
    button.addEventListener("click", () => {
      setResult(item, 1);
      typingPad.focus();
    });
    history.appendChild(button);
  }
}

function setResult(item: KidWord, score: number) {
  lastResult = item;
  guessedWord.textContent = item.word;
  thaiMeaning.textContent = item.thai;
  scoreBadge.textContent = `${Math.round(score * 100)}%`;
  showImage(item);
  showSplash(item);

  historyItems = [item, ...historyItems.filter(entry => entry.word !== item.word)].slice(0, 10);
  renderHistory();
  burst();
  audio.playWord(item);
}

function scheduleGuess() {
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(() => {
    const clean = cleanInput(buffer);
    if (!clean) return;

    const result = guessWord(clean, WORDS);
    setResult(result.item, result.score);
    buffer = "";
    liveBuffer.textContent = "รอคำต่อไป";
  }, 500);
}

function clearAll() {
  buffer = "";
  typingPad.innerHTML = "";
  liveBuffer.textContent = "เริ่มพิมพ์ได้เลย";
  guessedWord.textContent = "ready";
  scoreBadge.textContent = "0%";
  thaiMeaning.textContent = "หยุดพิมพ์ 0.5 วินาที แล้วระบบจะเดาคำศัพท์ง่าย ๆ";
  emojiFallback.textContent = "✨";
  wordImage.hidden = true;
  emojiFallback.hidden = false;
  typingPad.focus();
}

typingPad.addEventListener("keydown", event => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  if (event.key === "Backspace") {
    event.preventDefault();
    buffer = buffer.slice(0, -1);
    liveBuffer.textContent = buffer || "เริ่มพิมพ์ได้เลย";
    typingPad.lastChild?.remove();
    scheduleGuess();
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    typingPad.appendChild(document.createElement("br"));
    buffer = "";
    liveBuffer.textContent = "ขึ้นบรรทัดใหม่";
    burst();
    return;
  }

  if (event.key.length !== 1) return;

  event.preventDefault();
  audio.unlock();
  addTypedCharacter(event.key);

  if (/[a-z]/i.test(event.key)) {
    buffer += event.key.toLowerCase();
    liveBuffer.textContent = buffer;
    scheduleGuess();
  } else if (event.key === " ") {
    scheduleGuess();
  }
});

document.addEventListener("pointerdown", () => {
  audio.unlock();
  typingPad.focus();
});

voiceModeButton.addEventListener("click", () => {
  useAssetVoice = !useAssetVoice;
  voiceModeButton.classList.toggle("active", useAssetVoice);
  voiceModeButton.title = useAssetVoice ? "ใช้ไฟล์เสียง AI ถ้ามี" : "ใช้เสียงจาก browser";
  typingPad.focus();
});

soundFxButton.addEventListener("click", () => {
  useSoundFx = !useSoundFx;
  soundFxButton.classList.toggle("active", useSoundFx);
  typingPad.focus();
});

sayAgainButton.addEventListener("click", () => {
  audio.playWord(lastResult);
  typingPad.focus();
});

clearPadButton.addEventListener("click", clearAll);

fullscreenButton.addEventListener("click", () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
  typingPad.focus();
});

if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => undefined;
}

wordTotal.textContent = WORDS.length.toLocaleString();
showImage(lastResult);
typingPad.focus();
