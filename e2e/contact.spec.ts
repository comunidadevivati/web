import { expect, test } from '@playwright/test';

test.describe('Contact', () => {
  test('opens the contact page from the main menu', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    await page.goto('/');

    await page
      .getByRole('navigation', { name: 'Menu principal' })
      .getByRole('link', { name: 'Contato' })
      .click();

    await expect(page).toHaveTitle('VIVA - Contato');
  });

  test('links WhatsApp to the community phone in a new tab', async ({ page }) => {
    await page.goto('/contato');

    await expect(
      page.getByRole('link', { name: 'Conversar pelo WhatsApp (abre em nova aba)' }),
    ).toHaveAttribute('href', 'https://wa.me/5567992550858');
  });

  test('opens social networks in a new tab', async ({ page }) => {
    await page.goto('/contato');

    await expect(
      page.getByRole('link', { name: 'Instagram da Comunidade Viva (abre em nova aba)' }),
    ).toHaveAttribute('target', '_blank');
  });

  test('has no horizontal scroll on small phones', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });

    await page.goto('/contato');

    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );

    expect(hasHorizontalScroll).toBe(false);
  });
});
