import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-loader-modal',
  standalone: true,
  imports: [],
  templateUrl: './loader-modal.component.html',
  styleUrls: ['./loader-modal.component.scss']
})
export class LoaderModalComponent {
  @Input() isVisible: boolean = false;
  @Input() progress: number = 60;
  @Input() title: string = 'Fingerprint Analysis';
  @Input() message: string = 'Processing';
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
