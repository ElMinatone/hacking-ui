import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-access-denied-modal',
  standalone: true,
  imports: [],
  templateUrl: './access-denied-modal.component.html',
  styleUrls: ['./access-denied-modal.component.scss']
})
export class AccessDeniedModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() exitTerminal = new EventEmitter<void>();
  @Output() runDiagnostics = new EventEmitter<void>();

  onCloseModal(): void {
    this.closeModal.emit();
  }

  onExitTerminal(): void {
    this.exitTerminal.emit();
  }

  onRunDiagnostics(): void {
    this.runDiagnostics.emit();
  }
}
