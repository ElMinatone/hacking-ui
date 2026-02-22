import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private activeModal: string | null = null;
  private loaderVisible: boolean = false;
  private loaderProgress: number = 0;

  showModal(modalId: string): void {
    this.activeModal = modalId;
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('modal-active');
    }
  }

  hideModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('modal-active');
    }
    this.activeModal = null;
  }

  hideAllModals(): void {
    const modals = document.querySelectorAll('[id$="-modal"]');
    modals.forEach(modal => {
      modal.classList.remove('modal-active');
    });
    this.activeModal = null;
  }

  getActiveModal(): string | null {
    return this.activeModal;
  }

  // Access Denied Modal
  showAccessDenied(): void {
    this.showModal('access-denied-modal');
  }

  hideAccessDenied(): void {
    this.hideModal('access-denied-modal');
  }

  // Access Granted Modal
  showAccessGranted(): void {
    this.showModal('access-granted-modal');
  }

  hideAccessGranted(): void {
    this.hideModal('access-granted-modal');
  }

  // Loader Modal
  showLoader(title: string = 'Fingerprint Analysis', message: string = 'Processing'): void {
    this.loaderVisible = true;
    this.loaderProgress = 0;
  }

  hideLoader(): void {
    this.loaderVisible = false;
    this.loaderProgress = 0;
  }

  updateLoaderProgress(progress: number): void {
    this.loaderProgress = Math.min(100, Math.max(0, progress));
  }

  getLoaderState(): { visible: boolean; progress: number } {
    return {
      visible: this.loaderVisible,
      progress: this.loaderProgress
    };
  }

  // Simulate loading progress
  simulateLoading(duration: number = 3000, onComplete?: () => void): void {
    this.showLoader();
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      this.updateLoaderProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(progressInterval);
        setTimeout(() => {
          this.hideLoader();
          if (onComplete) onComplete();
        }, 500);
      }
    }, interval);
  }
}
