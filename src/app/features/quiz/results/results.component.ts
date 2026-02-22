import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

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
          <h2 class="text-xl font-semibold text-gray-500 mb-2">Your Score</h2>
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

        <!-- Play again -->
        <button
          (click)="playAgain.emit()"
          class="bg-hp-yellow hover:bg-hp-amber text-hp-black font-bold text-lg py-4 px-12 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-hp-yellow focus:ring-offset-2"
          aria-label="Play the quiz again"
        >
          🔄 Play Again
        </button>
      </div>
    </div>
  `,
})
export class ResultsComponent {
  readonly score = input.required<number>();
  readonly totalQuestions = input.required<number>();
  readonly playAgain = output<void>();

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
      return "Outstanding! You're a true wizarding world expert — Dumbledore himself would be proud! 🦁";
    if (p >= 70)
      return 'Exceeds Expectations! A true Hufflepuff spirit — hardworking and dedicated! ⚡';
    if (p >= 50) return 'Acceptable! Not bad, but there is always more to learn at Hogwarts! 📖';
    if (p >= 30)
      return 'Poor... Time for some extra tutoring from Professor McGonagall! 🏰';
    return 'Troll! Even a first-year muggle knows more. Back to chapter one! 📚';
  });

  readonly scoreBarClass = computed(() => {
    const p = this.percentage();
    if (p >= 70) return 'bg-green-500';
    if (p >= 50) return 'bg-hp-yellow';
    if (p >= 30) return 'bg-orange-400';
    return 'bg-red-400';
  });
}
