import { computed, inject, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Character } from '../models/character.model';
import { QuizQuestion } from '../models/quiz-question.model';
import { Spell } from '../models/spell.model';
import { HpApiService } from './hp-api.service';

const HOUSES = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];
const QUIZ_LENGTH = 10;

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly hpApi = inject(HpApiService);

  readonly currentQuestionIndex = signal(0);
  readonly score = signal(0);
  readonly questions = signal<QuizQuestion[]>([]);
  readonly isComplete = signal(false);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);

  readonly currentQuestion = computed(() => this.questions()[this.currentQuestionIndex()]);
  readonly totalQuestions = computed(() => this.questions().length);

  loadAndGenerateQuiz(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    forkJoin({
      characters: this.hpApi.getAllCharacters(),
      spells: this.hpApi.getAllSpells(),
    }).subscribe({
      next: ({ characters, spells }) => {
        const questions = this.generateQuestions(characters, spells);
        this.questions.set(questions);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  answerQuestion(answer: string): void {
    const current = this.currentQuestion();
    if (!current) return;

    if (answer === current.correctAnswer) {
      this.score.update((s) => s + 1);
    }

    const nextIndex = this.currentQuestionIndex() + 1;
    if (nextIndex >= this.totalQuestions()) {
      this.isComplete.set(true);
    } else {
      this.currentQuestionIndex.set(nextIndex);
    }
  }

  resetQuiz(): void {
    this.currentQuestionIndex.set(0);
    this.score.set(0);
    this.isComplete.set(false);
    this.questions.set([]);
    this.loadAndGenerateQuiz();
  }

  private generateQuestions(characters: Character[], spells: Spell[]): QuizQuestion[] {
    const allQuestions: QuizQuestion[] = [];

    // Generate multiple rounds to ensure enough questions
    for (let i = 0; i < 4; i++) {
      const houseQ = this.generateHouseQuestion(characters);
      if (houseQ) allQuestions.push(houseQ);

      const actorQ = this.generateActorQuestion(characters);
      if (actorQ) allQuestions.push(actorQ);

      const patronusQ = this.generatePatronusQuestion(characters);
      if (patronusQ) allQuestions.push(patronusQ);

      const spellQ = this.generateSpellQuestion(spells);
      if (spellQ) allQuestions.push(spellQ);
    }

    return this.shuffle(allQuestions).slice(0, QUIZ_LENGTH);
  }

  private generateHouseQuestion(characters: Character[]): QuizQuestion | null {
    const eligible = characters.filter((c) => c.house && HOUSES.includes(c.house));
    if (!eligible.length) return null;

    const character = this.pickRandom(eligible);
    const options = this.shuffle([...HOUSES]);

    return {
      question: $localize`:@@houseQuestion:Which house is ${character.name}:name: in?`,
      options,
      correctAnswer: character.house,
      category: 'house',
    };
  }

  private generateActorQuestion(characters: Character[]): QuizQuestion | null {
    const eligible = characters.filter((c) => c.actor && c.actor.trim());
    if (eligible.length < 4) return null;

    const character = this.pickRandom(eligible);
    const otherActors = [
      ...new Set(eligible.filter((c) => c.actor !== character.actor).map((c) => c.actor)),
    ];

    if (otherActors.length < 3) return null;

    const wrongAnswers = this.shuffle(otherActors).slice(0, 3);
    const options = this.shuffle([character.actor, ...wrongAnswers]);

    return {
      question: $localize`:@@actorQuestion:Who plays ${character.name}:name: in the movies?`,
      options,
      correctAnswer: character.actor,
      category: 'actor',
    };
  }

  private generatePatronusQuestion(characters: Character[]): QuizQuestion | null {
    const eligible = characters.filter((c) => c.patronus && c.patronus.trim());
    if (eligible.length < 4) return null;

    const character = this.pickRandom(eligible);
    const otherPatronus = [
      ...new Set(
        eligible.filter((c) => c.patronus !== character.patronus).map((c) => c.patronus),
      ),
    ];

    if (otherPatronus.length < 3) return null;

    const wrongAnswers = this.shuffle(otherPatronus).slice(0, 3);
    const options = this.shuffle([character.patronus, ...wrongAnswers]);

    return {
      question: $localize`:@@patronusQuestion:What is ${character.name}:name:'s patronus?`,
      options,
      correctAnswer: character.patronus,
      category: 'patronus',
    };
  }

  private generateSpellQuestion(spells: Spell[]): QuizQuestion | null {
    const eligible = spells.filter((s) => s.name && s.description && s.description.trim());
    if (eligible.length < 4) return null;

    const spell = this.pickRandom(eligible);
    const otherDescriptions = eligible.filter((s) => s.id !== spell.id).map((s) => s.description);

    if (otherDescriptions.length < 3) return null;

    const wrongAnswers = this.shuffle(otherDescriptions).slice(0, 3);
    const options = this.shuffle([spell.description, ...wrongAnswers]);

    return {
      question: $localize`:@@spellQuestion:What does the spell "${spell.name}" do?`,
      options,
      correctAnswer: spell.description,
      category: 'spell',
    };
  }

  private shuffle<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
