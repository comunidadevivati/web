import { expect, test } from '@playwright/test';

test.describe('Home', () => {
  test('displays the application heading', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: 'Comunidade Viva' })).toBeVisible();
  });

  test('displays the page name in the document title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('VIVA - Home');
  });
});
