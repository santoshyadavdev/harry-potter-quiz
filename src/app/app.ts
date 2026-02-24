import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  host: {
    '[class]': 'themeService.themeClass()',
  },
  template: '<router-outlet />',
})
export class App {
  protected readonly themeService = inject(ThemeService);
}
