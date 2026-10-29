import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Application shell. Renders the chrome once, driven by route data merged
 * along the active route's ancestry (`shell`, `nav`, `page`), and keeps the
 * one outlet mounted while the chrome toggles so routed components are never
 * constructed twice. Screens live under `pages/`, dialogs under `dialogs/`,
 * shared chrome under `shell/`.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
