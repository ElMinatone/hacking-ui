import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-access-granted-modal',
  standalone: true,
  imports: [],
  templateUrl: './access-granted-modal.component.html',
  styleUrls: ['./access-granted-modal.component.scss']
})
export class AccessGrantedModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() enterSystem = new EventEmitter<void>();
  @Output() viewLogs = new EventEmitter<void>();

  onCloseModal(): void {
    this.closeModal.emit();
  }

  onEnterSystem(): void {
    this.enterSystem.emit();
  }

  onViewLogs(): void {
    this.viewLogs.emit();
  }
}
