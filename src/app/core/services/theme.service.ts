import { afterNextRender, computed, effect, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export const HOUSES = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'] as const;
export type HouseTheme = (typeof HOUSES)[number];

const THEME_STORAGE_KEY = 'hp-quiz-theme';
const DEFAULT_THEME: HouseTheme = 'Hufflepuff';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly _theme = signal<HouseTheme>(DEFAULT_THEME);

  readonly theme = this._theme.asReadonly();
  readonly themeClass = computed(() => `theme-${this._theme().toLowerCase()}`);

  private initialized = false;

  constructor() {
    afterNextRender(() => {
      const stored = this.document.defaultView?.localStorage?.getItem(THEME_STORAGE_KEY);
      if (stored && (HOUSES as readonly string[]).includes(stored)) {
        this._theme.set(stored as HouseTheme);
      }
      this.initialized = true;
    });

    effect(() => {
      const theme = this._theme();
      if (this.initialized) {
        this.document.defaultView?.localStorage?.setItem(THEME_STORAGE_KEY, theme);
      }
    });
  }

  setTheme(theme: HouseTheme): void {
    this._theme.set(theme);
  }
}
