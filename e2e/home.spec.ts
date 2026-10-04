import { expect, test } from '@playwright/test';

test.describe('Home', () => {
  test('displays the application heading', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: 'Comunidade Viva' })).toBeVisible();
  });
});
