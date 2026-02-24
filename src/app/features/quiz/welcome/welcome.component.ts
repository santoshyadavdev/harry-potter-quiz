import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HOUSES, HouseTheme, ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-welcome',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-hp-background px-4 py-12">
      <div class="text-center max-w-2xl mx-auto">

        <!-- Top controls: language switcher (left) + theme selector (right) -->
        <div class="flex justify-between items-start flex-wrap gap-2 mb-4">
          <!-- Language switcher (left) -->
          <div class="flex flex-wrap gap-2">
            <a
              href="/en/quiz"
              class="text-xs font-semibold px-3 py-1 rounded-full border border-hp-primary/50 hover:bg-hp-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-hp-primary"
              i18n-aria-label="@@langSwitchEnLabel"
              aria-label="Switch to English"
            >
              <span i18n="@@langEnglish">English</span>
            </a>
            <a
              href="/de/quiz"
              class="text-xs font-semibold px-3 py-1 rounded-full border border-hp-primary/50 hover:bg-hp-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-hp-primary"
              i18n-aria-label="@@langSwitchDeLabel"
              aria-label="Switch to German"
            >
              <span i18n="@@langGerman">Deutsch</span>
            </a>
          </div>

          <!-- Theme selector (right) -->
          <div class="flex flex-wrap gap-2">
            @for (house of houses; track house) {
              <button
                (click)="themeService.setTheme(house)"
                [class]="getThemeButtonClass(house)"
                [attr.aria-label]="'Switch to ' + house + ' theme'"
                [attr.aria-pressed]="themeService.theme() === house"
              >
                {{ houseEmoji(house) }} {{ house }}
              </button>
            }
          </div>
        </div>

        <!-- House image -->
        <img
          [ngSrc]="houseImage()"
          [alt]="themeService.theme() + ' house crest'"
          width="150"
          height="150"
          class="mx-auto mb-4 rounded-full border-4 border-hp-primary shadow-lg transition-opacity duration-300"
          priority
        />

        <h1 class="text-5xl font-bold text-hp-black mb-3 tracking-tight">
          <span i18n="@@welcomeTitle">Harry Potter</span>
          <span class="block text-3xl text-hp-secondary mt-2 font-semibold">
            <span i18n="@@welcomeSubtitle">Wizarding World Quiz</span>
          </span>
        </h1>

        <div class="w-24 h-1 bg-hp-primary mx-auto my-6 rounded-full"></div>

        <p class="text-lg text-gray-700 mb-3 leading-relaxed" i18n="@@welcomeMessage">
          Welcome, young witch or wizard! Think you know enough about the wizarding world?
        </p>
        <p class="text-gray-600 mb-8" i18n="@@welcomeDescription">
          Test your knowledge with
          <strong class="text-hp-black">10 questions</strong>
          about Harry Potter characters, spells, houses, and more!
        </p>

        <!-- Tech stack -->
        <div class="mb-8">
          <p class="text-xs uppercase tracking-widest text-gray-400 mb-3 font-semibold" i18n="@@builtWith">Built With</p>
          <div class="flex flex-wrap justify-center gap-2">
            @for (tech of techStack; track tech) {
              <span class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-hp-primary/15 text-hp-black border border-hp-primary/30">
                {{ tech }}
              </span>
            }
          </div>
        </div>

        <button
          (click)="start.emit()"
          class="bg-hp-primary hover:bg-hp-secondary text-hp-black font-bold text-xl py-4 px-12 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-hp-primary focus:ring-offset-2"
          i18n-aria-label="@@startButtonLabel"
          aria-label="Start the Harry Potter Quiz"
        >
          <span i18n="@@startButton">⚡ Start Quiz</span>
        </button>

        <p class="mt-10 text-sm text-gray-400 italic" i18n="@@dumbledoreQuote">
          "It does not do to dwell on dreams and forget to live." — Albus Dumbledore
        </p>

        <!-- CodeRabbit attribution -->
        <p class="mt-4 text-xs text-gray-400">
          <span i18n="@@builtUsing">Built using</span>
          <a
            href="https://docs.coderabbit.ai/issues/planner"
            target="_blank"
            rel="noopener noreferrer"
            class="text-hp-secondary underline underline-offset-2 hover:text-hp-primary transition-colors focus:outline-none focus:ring-2 focus:ring-hp-primary focus:ring-offset-1 rounded"
          >CodeRabbit Issue Planner</a>
        </p>
      </div>
    </div>
  `,
})
export class WelcomeComponent {
  readonly start = output<void>();

  protected readonly themeService = inject(ThemeService);
  protected readonly houses = HOUSES;

  protected readonly techStack = [
    'Angular 21',
    'TailwindCSS 4',
    'SSR',
    'Cloudflare Workers',
  ];

  private static readonly HOUSE_EMOJIS: Record<HouseTheme, string> = {
    Gryffindor: '🦁',
    Hufflepuff: '🦡',
    Ravenclaw: '🦅',
    Slytherin: '🐍',
  };

  private static readonly HOUSE_IMAGES: Record<HouseTheme, string> = {
    Gryffindor: '/houses/gryffindor.png',
    Hufflepuff: '/houses/hufflepuff.png',
    Ravenclaw: '/houses/ravenclaw.png',
    Slytherin: '/houses/slytherin.png',
  };

  protected readonly houseImage = computed(() => WelcomeComponent.HOUSE_IMAGES[this.themeService.theme()]);

  protected houseEmoji(house: HouseTheme): string {
    return WelcomeComponent.HOUSE_EMOJIS[house];
  }

  protected getThemeButtonClass(house: HouseTheme): string {
    const base =
      'text-xs font-semibold px-3 py-1 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-hp-primary';
    return this.themeService.theme() === house
      ? `${base} bg-hp-primary border-hp-primary text-hp-black`
      : `${base} border-hp-primary/50 hover:bg-hp-primary/20`;
  }
}
