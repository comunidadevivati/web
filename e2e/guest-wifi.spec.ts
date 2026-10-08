import { expect, test, type Page } from '@playwright/test';

const portalUrl =
  '/wifi-visitantes?clientMac=AA-BB-CC-DD-EE-FF&clientIp=192.168.10.20&apMac=11-22-33-44-55-66' +
  '&ssidName=VIVA%20-%20Visitantes&radioId=1&site=Default&t=1791417600000' +
  '&redirectUrl=https%3A%2F%2Fwww.google.com%2F';

const acceptTermsAndFillForm = async (page: Page) => {
  await page.goto(portalUrl);

  await page.getByRole('checkbox').check();

  await page.getByRole('button', { name: 'Continuar' }).click();

  await page.getByLabel('Nome completo').fill('Maria da Silva');

  await page.getByLabel('Telefone (WhatsApp)').fill('67991066631');
};

test.describe('Guest Wi-Fi', () => {
  test('explains how to access when opened outside the captive portal', async ({ page }) => {
    await page.goto('/wifi-visitantes');

    await expect(page.getByText('Acesso indisponível')).toBeVisible();
  });

  test('requires accepting the terms before continuing', async ({ page }) => {
    await page.goto(portalUrl);

    await expect(page.getByRole('button', { name: 'Continuar' })).toBeDisabled();
  });

  test('masks the phone number while typing', async ({ page }) => {
    await acceptTermsAndFillForm(page);

    await expect(page.getByLabel('Telefone (WhatsApp)')).toHaveValue('(67) 99106-6631');
  });

  test('releases the internet after the form is submitted', async ({ page }) => {
    await page.route('**/api/guest-wifi/authorize', (route) => route.fulfill({ status: 204 }));

    await acceptTermsAndFillForm(page);

    await page.getByRole('button', { name: 'Conectar' }).click();

    await expect(page.getByRole('heading', { name: 'Você está conectado!' })).toBeVisible();
  });

  test('sends the portal client and visitor data to the authorization endpoint', async ({
    page,
  }) => {
    const requestPromise = page.waitForRequest('**/api/guest-wifi/authorize');

    await page.route('**/api/guest-wifi/authorize', (route) => route.fulfill({ status: 204 }));

    await acceptTermsAndFillForm(page);

    await page.getByRole('button', { name: 'Conectar' }).click();

    const request = await requestPromise;

    expect(request.postDataJSON()).toEqual({
      client: {
        type: 'eap',
        clientMac: 'AA-BB-CC-DD-EE-FF',
        clientIp: '192.168.10.20',
        apMac: '11-22-33-44-55-66',
        ssidName: 'VIVA - Visitantes',
        radioId: 1,
        site: 'Default',
      },
      visitor: {
        fullName: 'Maria da Silva',
        phone: '67991066631',
      },
      terms: {
        accepted: true,
        version: '2026-10-07',
      },
    });
  });

  test('shows an error when the internet cannot be released', async ({ page }) => {
    await page.route('**/api/guest-wifi/authorize', (route) => route.fulfill({ status: 502 }));

    await acceptTermsAndFillForm(page);

    await page.getByRole('button', { name: 'Conectar' }).click();

    await expect(page.getByText('Não foi possível liberar o acesso')).toBeVisible();
  });

  test('has no horizontal scroll on small phones', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });

    await page.goto(portalUrl);

    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );

    expect(hasHorizontalScroll).toBe(false);
  });
});
