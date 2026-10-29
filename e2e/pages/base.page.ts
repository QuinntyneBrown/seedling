/**
 * Shared chrome present on every Seedling screen.
 *
 * Locators follow the mocks' DOM contract (`docs/mocks/styles/app.css` BEM
 * classes, `data-nav`, `aria-current`, `aria-pressed`, roles + accessible
 * names). The Angular components render exactly the same classes on their
 * host and inner elements, so one locator set serves both the baseline
 * capture (mocks) and the verify / behaviour runs (app).
 *
 * One subclass per screen: `<screen>.page.ts` beside this file (`admin/` for
 * the admin app). Tests state intent; page objects know the DOM.
 */

import type { Locator, Page } from '@playwright/test';

import type { PageSlug } from '../fixtures/routes.js';

/** A control that may be an `<a>` (mocks, links) or a `<button>` (app). */
export function control(scope: Locator | Page, name: string | RegExp): Locator {
  return scope
    .getByRole('button', { name, exact: typeof name === 'string' })
    .or(scope.getByRole('link', { name, exact: typeof name === 'string' }));
}

export abstract class BasePage {
  /** `body[data-page]` this screen stamps. */
  abstract readonly slug: PageSlug;

  constructor(protected readonly page: Page) {}

  /** The element whose presence means the screen has rendered its content. */
  protected abstract readyAnchor(): Locator;

  /**
   * Waits for `body[data-page="<slug>"]` (route data in the app, a static
   * attribute in the mocks) and then for the page's own anchor element.
   */
  async waitForReady(slug: PageSlug = this.slug): Promise<void> {
    await this.page.waitForSelector(`body[data-page="${slug}"]`, { state: 'attached', timeout: 10_000 });
    await this.readyAnchor().first().waitFor({ state: 'attached', timeout: 10_000 });
  }

  get body(): Locator {
    return this.page.locator('body');
  }

  /** `<main id="main">` in the app and in the mocks. */
  get main(): Locator {
    return this.page.locator('main#main');
  }

  get skipLink(): Locator {
    return this.page.getByRole('link', { name: 'Skip to content' });
  }
}
