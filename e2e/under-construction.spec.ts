import { expect, test } from '@playwright/test';

test.describe('Under construction', () => {
  test('opens the under construction page from the main menu', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    await page.goto('/');

    await page
      .getByRole('navigation', { name: 'Menu principal' })
      .getByRole('link', { name: 'História' })
      .click();

    await expect(page.getByRole('heading', { name: 'Página em construção' })).toBeVisible();
  });

  test('returns to the previous page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    await page.goto('/contato');

    await page
      .getByRole('navigation', { name: 'Menu principal' })
      .getByRole('link', { name: 'Eventos' })
      .click();

    await page.getByRole('button', { name: 'Voltar' }).click();

    await expect(page).toHaveURL('/contato');
  });

  test('hides the back button when opened directly', async ({ page }) => {
    await page.goto('/eventos');

    await expect(page.getByRole('button', { name: 'Voltar' })).toHaveCount(0);
  });

  test('links to the home page', async ({ page }) => {
    await page.goto('/eventos');

    await expect(page.getByRole('link', { name: 'Ir para o início' })).toHaveAttribute('href', '/');
  });
});
