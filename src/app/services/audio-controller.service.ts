import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioController {
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private volumes: Map<string, number> = new Map();

  constructor() {
    this.initializeAudio('background', 'sounds/background.mp3', 0.22);
    this.initializeAudio('click-success', 'sounds/click-success.mp3', 0.16);
    this.initializeAudio('click-wrong', 'sounds/click-wrong.mp3', 0.6);
    this.initializeAudio('failure', 'sounds/failure.mp3', 0.7);
    this.initializeAudio('victory', 'sounds/victory.mp3', 0.8);

    // Segurança extra: monitora visibilidade
    setInterval(() => {
      if (!(window as any).__NUI_VISIBLE) {
        this.stopAll();
      }
    }, 300);
  }

  private initializeAudio(name: string, src: string, defaultVolume: number): void {
    const audio = new Audio(src);
    audio.volume = defaultVolume;
    this.audioElements.set(name, audio);
    this.volumes.set(name, defaultVolume);
  }

  play(name: string): void {
    const audio = this.audioElements.get(name);
    if (!audio) return;

    // 🔒 Bloqueia se NUI invisível
    if (!(window as any).__NUI_VISIBLE) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    audio.currentTime = 0;
    audio.play().catch(error => {
      console.error(`Error playing audio ${name}:`, error);
    });
  }

  setVolume(name: string, volume: number): void {
    const audio = this.audioElements.get(name);
    if (!audio) return;

    audio.volume = Math.max(0, Math.min(1, volume));
    this.volumes.set(name, audio.volume);
  }

  getVolume(name: string): number {
    return this.volumes.get(name) || 0;
  }

  setGlobalVolume(volume: number): void {
    this.volumes.forEach((_, name) => {
      this.setVolume(name, volume);
    });
  }

  stop(name: string): void {
    const audio = this.audioElements.get(name);
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  }

  stopAll(): void {
    this.audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
}