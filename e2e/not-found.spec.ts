import { expect, test } from '@playwright/test';

test.describe('Not found', () => {
  test('shows the not found page for unknown routes', async ({ page }) => {
    await page.goto('/rota-que-nao-existe');

    await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
  });

  test('links to the home page', async ({ page }) => {
    await page.goto('/rota-que-nao-existe');

    await expect(page.getByRole('link', { name: 'Ir para o início' })).toHaveAttribute('href', '/');
  });
});
