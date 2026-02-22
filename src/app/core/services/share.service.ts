import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const QUIZ_URL = 'https://littlequizzard.com/quiz';

@Injectable({ providedIn: 'root' })
export class ShareService {
  private readonly document = inject(DOCUMENT);

  private xMessage(score: number, total: number): string {
    return $localize`:@@shareXMessage:I scored ${score}:score:/${total}:total: on the Little Quizzard! 🧙‍♂️ Test your wizarding knowledge! @coderabbitai @santoshyadavdev ${QUIZ_URL}:url:`;
  }

  private hashtagMessage(score: number, total: number): string {
    return $localize`:@@shareHashtagMessage:I scored ${score}:score:/${total}:total: on the Little Quizzard! 🧙‍♂️ Test your wizarding knowledge! #coderabbitai #santoshyadavdev ${QUIZ_URL}:url:`;
  }

  shareToX(score: number, total: number): void {
    const text = encodeURIComponent(this.xMessage(score, total));
    this.openWindow(`https://twitter.com/intent/tweet?text=${text}`);
  }

  shareToLinkedIn(score: number, total: number): void {
    const url = encodeURIComponent(QUIZ_URL);
    const summary = encodeURIComponent(this.hashtagMessage(score, total));
    this.openWindow(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${summary}`,
    );
  }

  shareToFacebook(score: number, total: number): void {
    const url   = encodeURIComponent(QUIZ_URL);
    const quote = encodeURIComponent(this.hashtagMessage(score, total));
    this.openWindow(
      `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`,
    );
  }

  shareToWhatsApp(score: number, total: number): void {
    const text = encodeURIComponent(this.hashtagMessage(score, total));
    this.openWindow(`https://wa.me/?text=${text}`);
  }

  async copyToClipboard(score: number, total: number): Promise<boolean> {
    const text = this.hashtagMessage(score, total);
    try {
      await this.document.defaultView!.navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  private openWindow(url: string): void {
    this.document.defaultView?.open(url, '_blank', 'noopener,noreferrer');
  }
}
