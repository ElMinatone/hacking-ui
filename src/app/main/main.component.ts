import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

type GridCard = {
  fpIndex: number;
  gridIndex: number;
};

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy {
  protected readonly fingerprints: string[] = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDVpHOxD_U-CB2cKtO0CqYAm4gK1LrfiDCAYU4VgHlQ3LpY00azQCD5_oCqKqVzs61jLbVGjQcLHhfhC5KEOSM-oKfXnKnJBIYjntWgusA3K7XiqpDpwvRtfLf8C9zAiEXHj54mbiltCbt-K3hyXK0o6FPfFg4ahw6ULqF2SQ1wj7hAbLRSz-mABoA_SGwwBTu4Il4czIxdPB4qPYNIGMqc5QaMaDTgSt4wzYGp1vZ6GDkE6xXIePwmA45DtFFtOjQovcpbKgnF0TE',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAEvXmIzUlgoEfkzE-NZQYKhkAeGKrSpTuPF_lg3YpX3pWKoY3MIudwM2mQyydVDs7Oc2E_Lnfkrymhvm-xWThvA2wF0ecyc4qMFZ0NafYWKtrjwd2zOEUUxpP-1YXbCfhjNRSmr0RdTquVM47RgQ39FX6KWOOfQCq79QCOUW6yOLGLbIX1r00wxNqphnhYBQ9JgvXY6c92B3cO9G2ZJoyHwjdemNxpnRaaxB3iTqbp5C4D6GGaDHBlwDQbZ-Tw6I-Wj0QpsmwvCnI',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCR86oUQ-rnP6pQ8e5B3FL8LliNjeW-8OUWo-kgEbF9O3JYjPeY9cHft9QsyS4sYXiQ2iSWZlc_kPiO68q2KstExJhjZM1nkBqYs2RUb5ZEL79_6-dRhXyP_BFQ6KLjKzL41_QBIxlpV-aM5uR0LbzV--0up5TnhPDN71GbyrziMQWIRMbBj30kLagIEowblz06HOJBN9W7kRk3ezzVt4XAGcXT0XvV9FmILzcueJqpXCvggiGHCfChhVSTxXZ7v478bcjs9BBhLTo',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB8HL0hAQ5kPMCaPhDpOw-l0oH77pzxkxOY1FcpUv_LcjB8ZKRazm_xNKElXXIP47k_5B_sMEGXx2_85EHcWrQnv4tZZJRU9iz3VXZbegL3t2uAN3JbD7DIzwhvym2mISs_1zdohpCfrb17QcUgtE2kIkrqvmWVnvTCoT_HrOlNLMeTpWSh3dXUlio0Y-IGVaSHQ_brYeh8aC_AwWYa0WdjDhdBZ2xZmI128VdyKwygP15or_b8_MLL-6lxIVVxp0ehwRASBncTP6Y',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD2dDE2HW_h7ELzax5KKS01EUpQ6wTViXC9NDhJbNMjsRUMuyZZb3RUhcQdRVdJMn_qlePituKqdSX2AazOus4QncaFY47x14Bo8bqxu0g75JuWBGUwOHRn3QEVIfUXncIoJp08XrFspsdQjGZoqFFzwEIl1uxufWViU5BVnza4D7HufSsjMpvF2tLfcNkO5IKf3oToUIEekddjKN7sx_Xa59MzreSubRDvlv2pgrnPAW_JLFtoeLM9--br7auanqHSTlBwbQUkNE4',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCkVwK4w6gVJRx709ekEk7nEIykukBlTXScE38xdR6CrR1VOyIRNJMcTFmrfyqaGkt_sH_DxvXkd6iM5O1Cwdsv0J65NwIERCUYALNgcs_fG7PXzgnxmb-lB5w95bvN64Ecqg1xIaaf0xXHt1LNM9wG1UVVElK8167IMKwi9kmpvASLfH387suSI8d7ZAcXzSQ6ZbENhUqyfgmebBssf20zx-nXBgjuGGykqne56oWj-uj143Sp2rcWw4cz8GJT_K5G2zWvdMih4dE',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA6LK7mVIOUshw_YH2xViNDp-sTZwPkrmrNRvXSieji_dpk_hHVqNAtDDMrpsuHZiAm9be6ba6Mk2OHV0sx2TRdloKZhQJJaZlcfjoKgRZ9bhO95Oz4vRCDJ0IOHzGwcW5eUPRuAXQsq2JTSQZaUWLz-a7JCH2PikN9kCHzLeSZWdNjw_sbcE6OHstFPlyIsYPH2xQ0rybIqB2xEnTXVumRZ3aBLd83Qc4oc8AqAIJq14_KiLDbDVybepFUwBhn1121S_YGrqKkEaM',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB6crBBICIEKDO904Kls6SXhJParGaNiA1zlf2EMmxKzlpB2yxOiqo_QNJU3jOkXnvGrnnwg0p7Rp2TcRMAdnE6N_43m1dJ6-qo0z8yMye1n0BBu6Efe1RkVbgAFhc6Ic7mgbRWC0I9FE0Qop35TJ4mYxxGz_5Nu1sr-2tuWVoMj_J-uoI1ihRyezmuH7E_iueZ8fv_h9h5YyB2viRW31lHqBxL3PKmMfadlaYztbM0O4C3Me7gCr2lcS2AEyolDS2uhbnaj4BaGqs'
  ];

  protected targetFingerprint = 0;
  protected gridCards: GridCard[] = [];

  protected isPlaying = false;

  protected progress = 0;
  protected readonly requiredProgress = 5;
  protected isCompleted = false;

  protected isLoading = true;
  protected loaderProgress = 0;

  protected correctGridIndices = new Set<number>();
  protected wrongGridIndex: number | null = null;

  protected selectedGridIndex: number | null = null;
  protected hasSelection = false;

  private timerIntervalId: number | null = null;
  private loaderIntervalId: number | null = null;

  private readonly roundDurationMs = 60_000;
  private roundEndsAt = 0;
  private remainingMs = this.roundDurationMs;

  ngOnInit(): void {
    this.startLoader();
  }

  ngOnDestroy(): void {
    this.stopTimer();
    this.stopLoader();
  }

  protected onCardClick(card: GridCard): void {
    if (!this.isPlaying) return;

    this.selectedGridIndex = card.gridIndex;
    this.hasSelection = true;

    if (card.fpIndex === this.targetFingerprint) {
      if (!this.correctGridIndices.has(card.gridIndex)) {
        this.correctGridIndices.add(card.gridIndex);
      }

      const totalCopies = this.gridCards.filter((c) => c.fpIndex === this.targetFingerprint).length;
      if (this.correctGridIndices.size >= totalCopies) {
        this.onGameWon();
      }
      return;
    }

    this.wrongGridIndex = card.gridIndex;
    window.setTimeout(() => {
      if (this.wrongGridIndex === card.gridIndex) {
        this.wrongGridIndex = null;
      }
    }, 500);
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
    if (card.gridIndex === 0) return '0.8';
    if (this.isCardCorrect(card)) return '1';
    return '0.6';
  }

  private startGame(): void {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.correctGridIndices.clear();
    this.wrongGridIndex = null;

    this.selectedGridIndex = null;
    this.hasSelection = false;

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

  private onGameWon(): void {
    this.stopTimer();
    this.isPlaying = false;

    this.progress += 1;
    if (this.progress >= this.requiredProgress) {
      this.isCompleted = true;
      this.stopTimer();
      this.isPlaying = false;
      return;
    }

    this.setupNewRound();
  }

  private onGameOver(): void {
    this.stopTimer();
    this.isPlaying = false;

    if (this.isCompleted) return;

    this.setupNewRound();
  }

  private setupNewRound(): void {
    if (this.isCompleted) return;

    this.targetFingerprint = Math.floor(Math.random() * this.fingerprints.length);

    const gridIndices: number[] = [];
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

    gridIndices.sort(() => Math.random() - 0.5);

    this.gridCards = gridIndices.map((fpIndex, gridIndex) => ({ fpIndex, gridIndex }));

    this.startGame();
  }

  private startLoader(): void {
    this.isLoading = true;
    this.loaderProgress = 0;
    this.isCompleted = false;
    this.progress = 0;

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
