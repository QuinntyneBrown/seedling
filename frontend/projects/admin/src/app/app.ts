import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Seedling Admin shell: the administration application on its own host,
 * sharing the `api` and `components` libraries and the sign-in with the
 * main app. Renders the chrome once from route data; a signed-in account
 * without the administrator role sees a gate instead of the outlet, so no
 * admin screen is constructed and nothing from `/api/admin/*` is requested.
 */
@Component({
  selector: 'sl-admin-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
