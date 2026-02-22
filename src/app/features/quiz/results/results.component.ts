import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { ShareService } from '../../../core/services/share.service';

@Component({
  selector: 'app-results',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-hp-cream flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-lg text-center">
        <!-- Result icon -->
        <div class="text-7xl mb-6" role="img" [attr.aria-label]="resultEmoji() + ' result'">
          {{ resultEmoji() }}
        </div>

        <!-- Score card -->
        <div class="bg-white rounded-3xl shadow-xl p-8 mb-6 border-t-4 border-hp-yellow">
          <h2 class="text-xl font-semibold text-gray-500 mb-2" i18n="@@yourScore">Your Score</h2>
          <div class="text-6xl font-bold text-hp-black mb-1">
            {{ score() }}<span class="text-3xl text-gray-400">/{{ totalQuestions() }}</span>
          </div>
          <div class="text-hp-amber font-bold text-lg">{{ percentage() }}%</div>

          <!-- Score bar -->
          <div
            class="mt-5 w-full bg-gray-200 rounded-full h-3"
            role="progressbar"
            [attr.aria-valuenow]="percentage()"
            aria-valuemin="0"
            aria-valuemax="100"
            i18n-aria-label="@@scoreBarLabel"
            [attr.aria-label]="'Score: ' + percentage() + ' percent'"
          >
            <div
              class="h-3 rounded-full transition-all duration-1000"
              [class]="scoreBarClass()"
              [style.width.%]="percentage()"
            ></div>
          </div>
        </div>

        <!-- Hufflepuff message -->
        <div class="bg-hp-yellow/20 border border-hp-yellow rounded-2xl p-6 mb-8">
          <p class="text-base font-semibold text-hp-black leading-relaxed">{{ message() }}</p>
        </div>

        <!-- Action buttons -->
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            (click)="playAgain.emit()"
            class="bg-hp-yellow hover:bg-hp-amber text-hp-black font-bold text-lg py-4 px-10 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-hp-yellow focus:ring-offset-2"
            i18n-aria-label="@@playAgainLabel"
            aria-label="Play the quiz again"
          >
            <span i18n="@@playAgain">🔄 Play Again</span>
          </button>
          <button
            (click)="showShareModal.set(true)"
            class="bg-hp-black hover:bg-gray-800 text-hp-yellow font-bold text-lg py-4 px-10 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-hp-yellow focus:ring-offset-2"
            i18n-aria-label="@@shareResultLabel"
            aria-label="Share your quiz result"
          >
            <span i18n="@@shareResult">🔗 Share Result</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Share modal -->
    @if (showShareModal()) {
      <div
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        (click)="closeModalOnBackdrop($event)"
      >
        <div
          class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center"
          (click)="$event.stopPropagation()"
        >
          <!-- Close button -->
          <div class="flex justify-end mb-2">
            <button
              (click)="showShareModal.set(false)"
              class="text-gray-400 hover:text-gray-700 rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-hp-yellow"
              i18n-aria-label="@@closeShareDialogLabel"
              aria-label="Close share dialog"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"/>
              </svg>
            </button>
          </div>

          <div class="text-4xl mb-3" aria-hidden="true">🧙‍♂️</div>
          <h2 id="share-modal-title" class="text-xl font-bold text-hp-black mb-1" i18n="@@shareModalTitle">Share Your Result</h2>
          <p class="text-sm text-gray-500 mb-6" i18n="@@shareModalDescription">
            You scored <strong class="text-hp-black">{{ score() }}/{{ totalQuestions() }}</strong> — let the wizarding world know!
          </p>

          <!-- Platform buttons -->
          <div class="grid grid-cols-2 gap-3">
            <button
              (click)="onShareX()"
              class="flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              i18n-aria-label="@@shareOnXLabel"
              aria-label="Share on X (Twitter)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.737l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/>
              </svg>
              <span i18n="@@shareTwitter">(Twitter)</span>
            </button>

            <button
              (click)="onShareLinkedIn()"
              class="flex items-center justify-center gap-2 bg-[#0077b5] hover:bg-[#005e93] text-white font-semibold py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077b5]"
              i18n-aria-label="@@shareOnLinkedInLabel"
              aria-label="Share on LinkedIn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"/>
              </svg>
              <span i18n="@@shareLinkedIn">LinkedIn</span>
            </button>

            <button
              (click)="onShareFacebook()"
              class="flex items-center justify-center gap-2 bg-[#1877f2] hover:bg-[#145ecb] text-white font-semibold py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877f2]"
              i18n-aria-label="@@shareOnFacebookLabel"
              aria-label="Share on Facebook"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z"/>
              </svg>
              <span i18n="@@shareFacebook">Facebook</span>
            </button>

            <button
              (click)="onShareWhatsApp()"
              class="flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#1da851] text-white font-semibold py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25d366]"
              i18n-aria-label="@@shareOnWhatsAppLabel"
              aria-label="Share on WhatsApp"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <span i18n="@@shareWhatsApp">WhatsApp</span>
            </button>
          </div>

          <!-- Copy for Instagram -->
          <button
            (click)="onCopyForInstagram()"
            class="mt-3 w-full flex items-center justify-center gap-2 border-2 border-hp-yellow hover:bg-hp-yellow/10 text-hp-black font-semibold py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hp-yellow"
            [attr.aria-label]="copyLabel()"
          >
            @if (copied()) {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.285 6.709a1 1 0 0 0-1.414-1.418L9 15.168l-3.875-3.875a1 1 0 0 0-1.414 1.414l4.582 4.583a1 1 0 0 0 1.414 0l10.578-10.581Z"/>
              </svg>
              <span i18n="@@copiedFeedback">Copied!</span>
            } @else {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              <span i18n="@@copyForInstagram">Copy for Instagram</span>
            }
          </button>
        </div>
      </div>
    }
  `,
})
export class ResultsComponent {
  private readonly shareService = inject(ShareService);

  readonly score = input.required<number>();
  readonly totalQuestions = input.required<number>();
  readonly playAgain = output<void>();

  readonly showShareModal = signal(false);
  readonly copied = signal(false);

  readonly copyLabel = computed(() =>
    this.copied()
      ? $localize`:@@copiedToClipboardLabel:Copied to clipboard`
      : $localize`:@@copyInstagramLabel:Copy share text for Instagram`,
  );

  readonly percentage = computed(() => Math.round((this.score() / this.totalQuestions()) * 100));

  readonly resultEmoji = computed(() => {
    const p = this.percentage();
    if (p >= 90) return '🏆';
    if (p >= 70) return '⭐';
    if (p >= 50) return '📚';
    if (p >= 30) return '🦉';
    return '🧙';
  });

  readonly message = computed(() => {
    const p = this.percentage();
    if (p >= 90)
      return $localize`:@@scoreOutstanding:Outstanding! You're a true wizarding world expert — Dumbledore himself would be proud! 🦁`;
    if (p >= 70)
      return $localize`:@@scoreExceedsExpectations:Exceeds Expectations! A true Hufflepuff spirit — hardworking and dedicated! ⚡`;
    if (p >= 50)
      return $localize`:@@scoreAcceptable:Acceptable! Not bad, but there is always more to learn at Hogwarts! 📖`;
    if (p >= 30)
      return $localize`:@@scorePoor:Poor... Time for some extra tutoring from Professor McGonagall! 🏰`;
    return $localize`:@@scoreTroll:Troll! Even a first-year muggle knows more. Back to chapter one! 📚`;
  });

  readonly scoreBarClass = computed(() => {
    const p = this.percentage();
    if (p >= 70) return 'bg-green-500';
    if (p >= 50) return 'bg-hp-yellow';
    if (p >= 30) return 'bg-orange-400';
    return 'bg-red-400';
  });

  protected onShareX(): void {
    this.shareService.shareToX(this.score(), this.totalQuestions());
  }

  protected onShareLinkedIn(): void {
    this.shareService.shareToLinkedIn(this.score(), this.totalQuestions());
  }

  protected onShareFacebook(): void {
    this.shareService.shareToFacebook(this.score(), this.totalQuestions());
  }

  protected onShareWhatsApp(): void {
    this.shareService.shareToWhatsApp(this.score(), this.totalQuestions());
  }

  protected async onCopyForInstagram(): Promise<void> {
    const ok = await this.shareService.copyToClipboard(this.score(), this.totalQuestions());
    if (ok) {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    }
  }

  protected closeModalOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.showShareModal.set(false);
    }
  }
}
