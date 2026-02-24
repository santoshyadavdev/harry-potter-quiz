import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { QuizService } from '../../../core/services/quiz.service';
import { QuestionComponent } from '../question/question.component';
import { ResultsComponent } from '../results/results.component';
import { WelcomeComponent } from '../welcome/welcome.component';

type QuizState = 'welcome' | 'loading' | 'quiz' | 'results';

@Component({
  selector: 'app-quiz-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WelcomeComponent, QuestionComponent, ResultsComponent],
  template: `
    @switch (quizState()) {
      @case ('welcome') {
        <app-welcome (start)="startQuiz()" />
      }
      @case ('loading') {
        <div
          class="min-h-screen bg-hp-background flex items-center justify-center"
          role="status"
          aria-live="polite"
          i18n-aria-label="@@loadingLabel"
          aria-label="Loading quiz questions"
        >
          <div class="text-center">
            <div class="text-6xl mb-6 animate-bounce" aria-hidden="true">⚡</div>
            <p class="text-xl font-semibold text-hp-black" i18n="@@loadingMessage">Summoning wizarding knowledge...</p>
            <p class="text-gray-500 mt-2 text-sm" i18n="@@loadingSubMessage">Connecting to Hogwarts archives</p>
          </div>
        </div>
      }
      @case ('quiz') {
        <app-question
          [question]="quizService.currentQuestion()!"
          [questionNumber]="quizService.currentQuestionIndex() + 1"
          [totalQuestions]="quizService.totalQuestions()"
          (answered)="quizService.answerQuestion($event)"
        />
      }
      @case ('results') {
        <app-results
          [score]="quizService.score()"
          [totalQuestions]="quizService.totalQuestions()"
          (playAgain)="quizService.resetQuiz()"
        />
      }
    }

    @if (quizService.hasError()) {
      <div
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        role="alertdialog"
        aria-live="assertive"
        aria-modal="true"
        aria-labelledby="error-title"
        aria-describedby="error-description"
      >
        <div class="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl">
          <div class="text-5xl mb-4" aria-hidden="true">❌</div>
          <h2 id="error-title" class="text-xl font-bold text-gray-800 mb-2" i18n="@@errorTitle">Spell Failed!</h2>
          <p id="error-description" class="text-gray-600 mb-6" i18n="@@errorDescription">
            Could not connect to the wizarding archives. Please check your connection and try
            again.
          </p>
          <button
            (click)="quizService.loadAndGenerateQuiz()"
            class="bg-hp-primary text-hp-black font-bold py-2 px-6 rounded-full hover:bg-hp-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-hp-primary focus:ring-offset-2"
            i18n-aria-label="@@tryAgainLabel"
            aria-label="Try loading the quiz again"
          >
            <span i18n="@@tryAgain">Try Again</span>
          </button>
        </div>
      </div>
    }
  `,
})
export class QuizContainerComponent {
  protected readonly quizService = inject(QuizService);

  protected readonly quizState = computed<QuizState>(() => {
    if (this.quizService.isComplete()) return 'results';
    if (this.quizService.isLoading()) return 'loading';
    if (this.quizService.questions().length > 0) return 'quiz';
    return 'welcome';
  });

  protected startQuiz(): void {
    this.quizService.loadAndGenerateQuiz();
  }
}
