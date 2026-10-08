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

  test('returns to the page the user came from', async ({ page }) => {
    await page.goto('/contato');

    await page.goto('/rota-que-nao-existe');

    await page.getByRole('button', { name: 'Voltar' }).click();

    await expect(page).toHaveURL('/contato');
  });

  test('hides the back button when there is no previous page', async ({ context, page }) => {
    await page.goto('/contato');

    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.evaluate(() => window.open('/rota-que-nao-existe')),
    ]);

    await popup.getByRole('heading', { name: 'Página não encontrada' }).waitFor();

    await expect(popup.getByRole('button', { name: 'Voltar' })).toHaveCount(0);
  });
});
