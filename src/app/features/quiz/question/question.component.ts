import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { QuizQuestion } from '../../../core/models/quiz-question.model';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

@Component({
  selector: 'app-question',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-hp-cream flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-2xl">
        <!-- Progress header -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-semibold text-gray-500" i18n="@@questionProgress">
              Question {{ questionNumber() }} of {{ totalQuestions() }}
            </span>
            @switch (question().category) {
              @case ('house') {
                <span class="text-sm font-bold text-hp-copper uppercase tracking-wide" i18n="@@categoryHouse">house</span>
              }
              @case ('actor') {
                <span class="text-sm font-bold text-hp-copper uppercase tracking-wide" i18n="@@categoryActor">actor</span>
              }
              @case ('patronus') {
                <span class="text-sm font-bold text-hp-copper uppercase tracking-wide" i18n="@@categoryPatronus">patronus</span>
              }
              @case ('spell') {
                <span class="text-sm font-bold text-hp-copper uppercase tracking-wide" i18n="@@categorySpell">spell</span>
              }
              @default {
                <span class="text-sm font-bold text-hp-copper uppercase tracking-wide" i18n="@@categoryTrivia">trivia</span>
              }
            }
          </div>
          <div
            class="w-full bg-gray-200 rounded-full h-2"
            role="progressbar"
            [attr.aria-valuenow]="questionNumber() - 1"
            aria-valuemin="0"
            [attr.aria-valuemax]="totalQuestions()"
            i18n-aria-label="@@progressBarLabel"
            [attr.aria-label]="'Question ' + (questionNumber() - 1) + ' of ' + totalQuestions() + ' completed'"
          >
            <div
              class="bg-hp-yellow h-2 rounded-full transition-all duration-500"
              [style.width.%]="((questionNumber() - 1) / totalQuestions()) * 100"
            ></div>
          </div>
        </div>

        <!-- Question card -->
        <div class="bg-white rounded-3xl shadow-xl p-8 mb-6 border-t-4 border-hp-yellow">
          <h2 class="text-2xl font-bold text-hp-black leading-snug" id="question-heading">
            {{ question().question }}
          </h2>
        </div>

        <!-- Answer options -->
        <div
          class="grid grid-cols-1 gap-3"
          role="group"
          i18n-aria-labelledby="@@questionHeadingRef"
          aria-labelledby="question-heading"
        >
          @for (option of question().options; track $index) {
            <button
              (click)="selectAnswer(option)"
              [disabled]="selectedAnswer() !== null"
              [class]="getOptionClass(option)"
              [attr.aria-pressed]="selectedAnswer() === option"
              [attr.aria-disabled]="selectedAnswer() !== null && selectedAnswer() !== option"
            >
              <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-current/10 text-sm font-bold mr-3 shrink-0">
                {{ getOptionLabel($index) }}
              </span>
              <span>{{ option }}</span>
            </button>
          }
        </div>

        <!-- Confirm button (shown after selection) -->
        @if (selectedAnswer() !== null) {
          <div class="mt-6 flex justify-end">
            @if (isLastQuestion()) {
              <button
                (click)="confirmAnswer()"
                class="bg-hp-black text-hp-yellow font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-hp-black focus:ring-offset-2"
                i18n-aria-label="@@seeResultsLabel"
                aria-label="See your quiz results"
              >
                <span i18n="@@seeResults">🏆 See Results</span>
              </button>
            } @else {
              <button
                (click)="confirmAnswer()"
                class="bg-hp-black text-hp-yellow font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-hp-black focus:ring-offset-2"
                i18n-aria-label="@@nextQuestionLabel"
                aria-label="Go to next question"
              >
                <span i18n="@@nextQuestion">Next Question →</span>
              </button>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class QuestionComponent {
  readonly question = input.required<QuizQuestion>();
  readonly questionNumber = input.required<number>();
  readonly totalQuestions = input.required<number>();
  readonly answered = output<string>();

  readonly selectedAnswer = signal<string | null>(null);
  readonly isLastQuestion = computed(() => this.questionNumber() === this.totalQuestions());

  constructor() {
    // Reset selected answer whenever the question changes
    effect(() => {
      this.question();
      untracked(() => this.selectedAnswer.set(null));
    });
  }

  protected getOptionLabel(index: number): string {
    return OPTION_LABELS[index] ?? String(index + 1);
  }

  protected getOptionClass(option: string): string {
    const base =
      'flex items-center w-full text-left p-4 rounded-2xl border-2 font-medium text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    const selected = this.selectedAnswer();
    const correct = this.question().correctAnswer;

    if (selected === null) {
      return `${base} bg-white border-gray-200 text-gray-800 hover:border-hp-yellow hover:bg-yellow-50 cursor-pointer focus:ring-hp-yellow`;
    }
    if (option === correct) {
      return `${base} bg-green-50 border-green-500 text-green-800 focus:ring-green-500`;
    }
    if (option === selected) {
      return `${base} bg-red-50 border-red-500 text-red-800 focus:ring-red-500`;
    }
    return `${base} bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed`;
  }

  protected selectAnswer(option: string): void {
    if (this.selectedAnswer() !== null) return;
    this.selectedAnswer.set(option);
  }

  protected confirmAnswer(): void {
    const answer = this.selectedAnswer();
    if (answer === null) return;
    this.answered.emit(answer);
  }
}
