import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/quiz', pathMatch: 'full' },
  {
    path: 'quiz',
    loadComponent: () =>
      import('./features/quiz/quiz-container/quiz-container.component').then(
        (m) => m.QuizContainerComponent,
      ),
  },
];
