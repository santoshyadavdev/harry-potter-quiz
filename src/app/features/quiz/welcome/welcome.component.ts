import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-welcome',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-hp-cream px-4 py-12">
      <div class="text-center max-w-2xl mx-auto">
        <div class="text-8xl mb-6" role="img" aria-label="Hufflepuff badger">🦡</div>

        <h1 class="text-5xl font-bold text-hp-black mb-3 tracking-tight">
          Harry Potter
          <span class="block text-3xl text-hp-amber mt-2 font-semibold">
            Wizarding World Quiz
          </span>
        </h1>

        <div class="w-24 h-1 bg-hp-yellow mx-auto my-6 rounded-full"></div>

        <p class="text-lg text-gray-700 mb-3 leading-relaxed">
          Welcome, young witch or wizard! Think you know enough about the wizarding world?
        </p>
        <p class="text-gray-600 mb-10">
          Test your knowledge with
          <strong class="text-hp-black">10 questions</strong>
          about Harry Potter characters, spells, houses, and more!
        </p>

        <button
          (click)="start.emit()"
          class="bg-hp-yellow hover:bg-hp-amber text-hp-black font-bold text-xl py-4 px-12 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-hp-yellow focus:ring-offset-2"
          aria-label="Start the Harry Potter Quiz"
        >
          ⚡ Start Quiz
        </button>

        <p class="mt-10 text-sm text-gray-400 italic">
          "It does not do to dwell on dreams and forget to live." — Albus Dumbledore
        </p>
      </div>
    </div>
  `,
})
export class WelcomeComponent {
  readonly start = output<void>();
}
