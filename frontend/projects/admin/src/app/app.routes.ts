import { Routes } from '@angular/router';

/**
 * Admin routes. `/sign-in` is the bare shell; every other route chains the
 * `requireAuth` and `requireAdmin` guards from `api` and lazy-loads its
 * screen from `pages/<page>/`.
 */
export const routes: Routes = [];
