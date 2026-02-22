import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioController } from '../services/audio-controller.service';
import { AccessDeniedModalComponent } from '../components/access-denied-modal/access-denied-modal.component';
import { AccessGrantedModalComponent } from '../components/access-granted-modal/access-granted-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

type GridCard = {
  fpIndex: number;
  gridIndex: number;
};

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, AccessDeniedModalComponent, AccessGrantedModalComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainComponent implements OnInit, OnDestroy {
  protected readonly fingerprints: string[] = [
    'images/finger1.png',
    'images/finger2.png',
    'images/finger3.png',
    'images/finger4.png',
    'images/finger5.png',
    'images/finger6.png',
    'images/finger7.png',
    'images/finger8.png',
  ];

  protected targetFingerprint = 0;
  protected gridCards: GridCard[] = [];

  protected isPlaying = false;

  protected progress = 0;
  protected readonly requiredProgress = 5;
  protected isCompleted = false;
  protected isSuccessClosing = false;

  protected totalAttempts = 3;
  protected usedAttempts = 0;

  protected isLoading = true;
  protected isGameOver = false;
  protected isFailureClosing = false;
  protected loaderProgress = 0;

  protected correctGridIndices = new Set<number>();

  protected clickedGridIndices = new Set<number>();

  private lastTargetFingerprint: number | null = null;

  private timerIntervalId: number | null = null;
  private loaderIntervalId: number | null = null;

  private readonly roundDurationMs = 60_000;
  private roundEndsAt = 0;
  private remainingMs = this.roundDurationMs;

  constructor(private audioController: AudioController) {}

  ngOnInit(): void {
    window.addEventListener('message', (event) => {

      if (!event.data) return;

      // Evento vindo do Lua
      if (event.data.action === 'startHack') {
        this.startSession();
      }

      if (event.data.action === 'forceClose') {
        this.endSession();
      }

    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
    this.stopLoader();
  }

  protected onCardClick(card: GridCard): void {
    if (!this.isPlaying) return;

    if (card.fpIndex === this.targetFingerprint) {
      this.clickedGridIndices.add(card.gridIndex);
      
      if (!this.correctGridIndices.has(card.gridIndex)) {
        this.correctGridIndices.add(card.gridIndex);
      }

      const totalCopies = this.gridCards.filter((c) => c.fpIndex === this.targetFingerprint).length;
      if (this.correctGridIndices.size >= totalCopies) {
        this.onGameWon();
      }
      return;
    }

    // Wrong click: consume attempt
    this.consumeAttempt();
  }

  protected getTimerText(): string {
    const total = Math.max(0, this.remainingMs);
    const seconds = Math.floor(total / 1000);
    const centiseconds = Math.floor((total % 1000) / 10);
    return `00:${String(seconds).padStart(2, '0')}:${String(centiseconds).padStart(2, '0')}`;
  }

  protected isCardCorrect(card: GridCard): boolean {
    return this.correctGridIndices.has(card.gridIndex);
  }

  protected getCardOpacity(card: GridCard): string {
    // if (card.gridIndex === 0) return '0.8';
    if (this.isCardCorrect(card)) return '1';
    return '0.6';
  }

  // Prepara estado inicial do jogo (não inicia loader automaticamente)
  protected resetState(): void {
    this.stopTimer();
    this.stopLoader();
    
    // Estado base
    this.progress = 0;
    this.usedAttempts = 0;
    this.isPlaying = false;
    this.isGameOver = false;
    this.isCompleted = false;
    this.loaderProgress = 0;
    this.isLoading = false;
    
    // Limpa coleções
    this.correctGridIndices.clear();
    this.clickedGridIndices.clear();
    
    // Timer e rodada
    this.remainingMs = this.roundDurationMs;
    this.lastTargetFingerprint = null;
    this.gridCards = [];
  }

  // Inicia uma nova sessão do minigame (reset + loader + áudio)
  protected startSession(): void {
    this.resetState();
    this.isLoading = true;
    this.audioController.stopAll();
    this.audioController.play('background');
    this.startLoader();
  }

  // Finaliza a sessão atual (para timers, limpa estado e áudios)
  protected endSession(): void {
    this.stopTimer();
    this.stopLoader();
    this.audioController.stopAll();
    this.resetState();
  }

  private startGame(): void {
    if (this.isPlaying) return;

    if (this.usedAttempts >= this.totalAttempts) {
      this.isGameOver = true;
      setTimeout(() => {
        this.isGameOver = false;
        this.startLoader();
      }, 5000);
      return;
    }

    this.isPlaying = true;
    this.correctGridIndices.clear();

    this.clickedGridIndices.clear();

    this.roundEndsAt = Date.now() + this.roundDurationMs;
    this.remainingMs = this.roundDurationMs;

    this.stopTimer();
    this.timerIntervalId = window.setInterval(() => {
      this.remainingMs = Math.max(0, this.roundEndsAt - Date.now());
      if (this.remainingMs <= 0) {
        this.onGameOver();
      }
    }, 25);
  }

  private stopTimer(): void {
    if (this.timerIntervalId !== null) {
      window.clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }
  }

  private sendHackResult(result: 'success' | 'failed'): void {
    const anyWin: any = window as any;
    try {
      if (typeof anyWin.GetParentResourceName === 'function') {
        const res = anyWin.GetParentResourceName();
        fetch(`https://${res}/hackResult`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ result })
        }).catch(() => {
          window.parent?.postMessage({ type: 'hackResult', result }, '*');
        });
        return;
      }
    } catch (e) {}
    try {
      window.parent?.postMessage({ type: 'hackResult', result }, '*');
    } catch (e) {}
  }


  private onGameWon(): void {
    this.stopTimer();
    this.isPlaying = false;

    this.progress += 1;
    if (this.progress >= this.requiredProgress) {
      this.isCompleted = true;
      this.stopTimer();
      this.isPlaying = false;

      this.audioController.play('victory');

      setTimeout(() => {
        this.isSuccessClosing = true;
      }, 1500);
      setTimeout(() => {
        this.sendHackResult('success');
        this.isCompleted = false;
        this.isSuccessClosing = false;
        this.startLoader();
      }, 4000);
      return;
    }

    // Play success sound for progress
    this.audioController.play('click-success');

    this.setupNewRound();
  }

  onGameOver(): void {
    this.stopTimer();
    this.isPlaying = false;

    if (this.isCompleted) return;

    // Timeout: consume attempt
    this.consumeAttempt();
    if (this.usedAttempts >= this.totalAttempts) {
      this.isGameOver = true;
      setTimeout(() => {
        this.isGameOver = false;
        this.startLoader();
      }, 5000);
    } else {
      this.resetRound();
    }
  }

  private resetRound(): void {
    this.stopTimer();
    this.isPlaying = false;
    this.correctGridIndices.clear();
    this.clickedGridIndices.clear();
    this.remainingMs = this.roundDurationMs;

    this.setupNewRound();
  }

  private consumeAttempt(): void {
    this.usedAttempts++;

    this.audioController.play('click-wrong');

    if (this.usedAttempts >= this.totalAttempts) {
      this.isGameOver = true;
      setTimeout(() => {
        this.isFailureClosing = true;
      }, 1500);
      setTimeout(() => {
        this.sendHackResult('failed');
        this.isGameOver = false;
        this.isFailureClosing = false;
        this.startLoader();
      }, 4000);
    } else {
      // Still have attempts: reset round
      this.resetRound();
    }
  }

  private setupNewRound(): void {
    if (this.isCompleted) return;

    this.clickedGridIndices.clear();

    const getRandomFingerprintExcluding = (exclude: number | null): number => {
      let candidates = Array.from({length: this.fingerprints.length}, (_, i) => i);
      if (exclude !== null) {
        candidates = candidates.filter(i => i !== exclude);
      }
      return candidates[Math.floor(Math.random() * candidates.length)];
    };

    const shuffleArray = <T>(array: T[]): T[] => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    this.targetFingerprint = getRandomFingerprintExcluding(this.lastTargetFingerprint);
    this.lastTargetFingerprint = this.targetFingerprint;

    let gridIndices: number[] = [];
    const targetCopies = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < targetCopies; i += 1) {
      gridIndices.push(this.targetFingerprint);
    }

    while (gridIndices.length < 8) {
      let randomIndex = 0;
      do {
        randomIndex = Math.floor(Math.random() * this.fingerprints.length);
      } while (randomIndex === this.targetFingerprint);
      gridIndices.push(randomIndex);
    }

    gridIndices = shuffleArray(gridIndices);

    this.gridCards = gridIndices.map((fpIndex, gridIndex) => ({ fpIndex, gridIndex }));

    this.startGame();
  }

  private startLoader(): void {
    this.isLoading = true;
    this.isGameOver = false;
    this.loaderProgress = 0;
    this.isCompleted = false;
    this.progress = 0;
    this.usedAttempts = 0;

    this.stopLoader();
    const durationMs = 2200;
    const startedAt = Date.now();

    this.loaderIntervalId = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      this.loaderProgress = Math.min(100, Math.round((elapsed / durationMs) * 100));

      if (this.loaderProgress >= 100) {
        this.stopLoader();
        this.isLoading = false;
        this.setupNewRound();
      }
    }, 30);
  }

  private stopLoader(): void {
    if (this.loaderIntervalId !== null) {
      window.clearInterval(this.loaderIntervalId);
      this.loaderIntervalId = null;
    }
  }
}
