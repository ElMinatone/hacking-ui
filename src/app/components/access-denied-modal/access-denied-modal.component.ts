import { Component, EventEmitter, Output, Input } from '@angular/core';
import { AudioController } from '../../services/audio-controller.service';

@Component({
  selector: 'app-access-denied-modal',
  standalone: true,
  imports: [],
  template: `
    <div class="fixed inset-0 bg-terminal-bg/90 flex items-center justify-center z-50 opacity-0 pointer-events-none transition-all duration-700" [class.opacity-100]="visible || closing" [class.pointer-events-auto]="visible || closing">
      <div class="w-[600px] border-2 border-red-500 bg-terminal-bg relative shadow-[0_0_50px_rgba(239,68,68,0.3)] p-6 space-y-6 transform scale-0 rotate-12 transition-all duration-700" [class.scale-100]="visible" [class.rotate-0]="visible" [style.animation]="closing ? 'windowClose 0.5s ease-in forwards' : (visible ? 'windowOpen 0.5s ease-out forwards' : 'none')">
        <div class="bg-red-500 flex justify-between items-center px-4 py-1">
          <h1 class="text-background-dark font-display font-bold uppercase tracking-widest text-sm">TERMINAL ERROR — 0X000F4</h1>
          <div class="flex gap-4">
            <span class="text-background-dark font-bold cursor-pointer hover:opacity-70" (click)="onCloseModal()">X</span>
          </div>
        </div>
        <div class="text-center space-y-4">
          <div class="mb-2">
            <svg class="w-24 h-24 text-red-500 mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 class="text-6xl font-display text-red-500 tracking-tighter relative glitch-text" [style.animation]="visible ? 'glitch1 2s infinite, glitch2 3s infinite 0.75s, glitch3 4s infinite 1s, glitch4 2s infinite 1.5s' : 'none'">
            ACCESS DENIED
            <span class="absolute inset-0 text-cyan-400 opacity-50 blur-sm animate-pulse" [style.animation]="visible ? 'glitch2 3s infinite 0.75s, glitch3 4s infinite 1.25s' : 'none'">ACCESS DENIED</span>
          </h2>
          <p class="text-red-400 text-sm uppercase tracking-wider underline" [style.animation]="visible ? 'glitch2 3s infinite 0.75s, glitch3 4s infinite 1.5s' : 'none'">INTRUSION DETECTED</p>
          <p class="text-red-300 text-xs leading-relaxed" [style.animation]="visible ? 'glitch3 4s infinite 1s, glitch4 2s infinite 1.5s' : 'none'">
            Unauthorized access attempt recorded from remote node.<br>
            Local encryption keys have been purged. System lockdown<br>
            protocol X-RAY-9 initiated.
          </p>
          <p class="text-red-400 text-xs mt-4" [style.animation]="visible ? 'glitch4 2s infinite 1.5s, glitch1 2s infinite 2s' : 'none'">
            Node ID: 218.45.1.99 | Trace Level: Critical
          </p>
          <div class="space-y-2 mt-6">
            <p class="text-red-400 text-xs uppercase tracking-wider">SYSTEM PURGE IN PROGRESS</p>
            <div class="h-4 border border-red-500 relative overflow-hidden bg-black">
              <div class="absolute top-0 left-0 bottom-0 bg-red-500 w-[84%] animate-pulse"></div>
              <span class="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">84% COMPLETE</span>
            </div>
          </div>
          <div class="flex gap-4 justify-center mt-8">
            <button class="bg-red-500 text-black px-6 py-2 font-bold uppercase tracking-wider text-sm hover:bg-red-600 transition-colors flex items-center gap-2" (click)="onExitTerminal()">
              <span>←</span> EXIT TERMINAL
            </button>
            <button class="border border-red-500 text-red-400 px-6 py-2 font-bold uppercase tracking-wider text-sm hover:bg-red-500 hover:text-black transition-colors" (click)="onRunDiagnostics()">
              DIAGNOSTICS
            </button>
          </div>
        </div>
        <div class="border-t border-red-500/20 p-2 px-8 flex justify-between items-center text-[10px] text-red-400/60">
          <div class="flex gap-6">
            <span>SECURITY_LEVEL: 18</span>
            <span>ENCRYPTION: AES-256-GCM</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-red-500 animate-ping"></div>
            <span>ALERT_ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .glitch-text {
      text-shadow: 2px 0 #ef4444, -2px 0 #00FFD1;
      animation: glitch1 2s infinite;
    }
    
    @keyframes glitch1 {
      0%, 100% {
        text-shadow: 2px 0 #ef4444, -2px 0 #00FFD1;
      }
      25% {
        text-shadow: -2px 0 #ef4444, 2px 0 #00FFD1;
      }
      50% {
        text-shadow: 2px 0 #00FFD1, -2px 0 #ef4444;
      }
      75% {
        text-shadow: -2px 0 #00FFD1, 2px 0 #ef4444;
      }
    }
    
    @keyframes windowOpen {
      0% {
        transform: scale(0.7) rotate(12deg);
        opacity: 0;
      }
      100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
      }
    }
    @keyframes windowClose {
      0% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: scale(0.7) rotate(-12deg);
        opacity: 0;
      }
    }
    
    @keyframes glitch2 {
      0%, 100% {
        transform: translate(0);
      }
      20% {
        transform: translate(-2px, 2px);
      }
      40% {
        transform: translate(-2px, -2px);
      }
      60% {
        transform: translate(2px, 2px);
      }
      80% {
        transform: translate(2px, -2px);
      }
    }
    
    @keyframes glitch3 {
      0%, 100% {
        filter: hue-rotate(0deg);
      }
      25% {
        filter: hue-rotate(90deg);
      }
      50% {
        filter: hue-rotate(180deg);
      }
      75% {
        filter: hue-rotate(270deg);
      }
    }
    
    @keyframes glitch4 {
      0%, 100% {
        opacity: 1;
      }
      10% {
        opacity: 0.8;
      }
      20% {
        opacity: 1;
      }
      30% {
        opacity: 0.9;
      }
      40% {
        opacity: 0.7;
      }
      50% {
        opacity: 1;
      }
      60% {
        opacity: 0.6;
      }
      70% {
        opacity: 1;
      }
      80% {
        opacity: 0.4;
      }
      90% {
        opacity: 1;
      }
    }
  `]
})
export class AccessDeniedModalComponent {
  @Input() visible = false;
  @Input() closing = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() exitTerminal = new EventEmitter<void>();
  @Output() runDiagnostics = new EventEmitter<void>();
  @Output() modalClosed = new EventEmitter<void>();

  constructor(private audioController: AudioController) {}

  ngOnInit() {
    if (this.visible) {
      this.audioController.play('failure');
    }
  }

  ngOnChanges() {
    if (this.visible) {
      this.audioController.play('failure');
    }
  }

  onCloseModal(): void {
    this.closeModal.emit();
    this.modalClosed.emit();
  }

  onExitTerminal(): void {
    this.exitTerminal.emit();
  }

  onRunDiagnostics(): void {
    this.runDiagnostics.emit();
  }
}
