import { Howl } from "howler";
import type { KidWord, LanguageCode } from "./words";

type VoiceMode = "asset" | "browser";

const languageToSpeech: Record<LanguageCode, string> = {
  en: "en-US",
  th: "th-TH"
};

export class AudioEngine {
  private cache = new Map<string, Howl>();
  private contextUnlocked = false;

  constructor(
    private getLanguage: () => LanguageCode,
    private getVoiceMode: () => VoiceMode
  ) {}

  unlock() {
    if (this.contextUnlocked) return;
    Howler.autoUnlock = true;
    this.contextUnlocked = true;
  }

  playKey(ch: string, enabled: boolean) {
    if (!enabled) return;
    this.unlock();

    const code = ch.toLowerCase().charCodeAt(0);
    const note = Number.isFinite(code) ? Math.max(0, Math.min(24, code - 97)) : 0;
    const frequency = 260 * Math.pow(2, note / 18);
    const audio = new AudioContext();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const now = audio.currentTime;

    osc.type = "triangle";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    osc.connect(gain).connect(audio.destination);
    osc.start(now);
    osc.stop(now + 0.16);
    window.setTimeout(() => audio.close(), 260);
  }

  playWord(item: KidWord) {
    this.unlock();
    const language = this.getLanguage();
    const assetPath = item.audio?.[language];

    if (this.getVoiceMode() === "asset" && assetPath) {
      this.playAsset(assetPath, () => this.speakWithBrowser(item, language));
      return;
    }

    this.speakWithBrowser(item, language);
  }

  private playAsset(path: string, fallback: () => void) {
    const sound = this.cache.get(path) ?? new Howl({
      src: [path],
      html5: false,
      preload: false,
      volume: 0.9,
      onloaderror: fallback,
      onplayerror: fallback
    });

    this.cache.set(path, sound);
    sound.stop();
    sound.play();
  }

  private speakWithBrowser(item: KidWord, language: LanguageCode) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(language === "th" ? item.thai : item.word);
    utterance.lang = languageToSpeech[language];
    utterance.rate = language === "th" ? 0.85 : 0.9;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === utterance.lang) ?? voices.find(v => v.lang.startsWith(language));
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  }
}
