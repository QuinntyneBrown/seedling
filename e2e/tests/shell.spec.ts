import { expect, test } from '../fixtures/seedling-test.js';

// Traces to: the application shell (AGENTS.md); replace with the L2 id once specified.
test.describe('application shell', () => {
  test('serves the main landmark with a skip link', async ({ page, goto }) => {
    await goto('home');
    await expect(page.locator('main#main')).toBeAttached();
    await expect(page.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
  });
});
