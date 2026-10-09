import { test, expect } from '@playwright/test';

test('built page loads player and local fonts', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('#doubleclicc-player')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pause animation' })).toBeVisible();
  for (const font of ['Inter-400.ttf', 'Inter-600.ttf', 'IBM-Plex-Mono-400.ttf']) {
    const response = await request.get(`fonts/${font}`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).not.toContain('text/html');
  }
  await expect.poll(() => page.evaluate(() => document.fonts.check('600 16px Inter'))).toBe(true);
  expect(errors).toEqual([]);
});

for (const name of ['Run Revenue Diagnostic — animated banner', 'Run Revenue Diagnostic']) {
  for (const action of ['click', 'keyboard']) {
    test(`${name} navigates to Google by ${action}`, async ({ page }) => {
      await page.route('https://google.com/**', route => route.fulfill({ body: 'Navigation reached Google' }));
      await page.goto('./');
      const link = page.locator('#doubleclicc-player').getByRole('link', { name, exact: true });
      await expect(link).toHaveAttribute('href', 'https://google.com/');
      if (action === 'click') await link.click();
      else { await link.focus(); await page.keyboard.press('Enter'); }
      await expect(page).toHaveURL('https://google.com/');
    });
  }
}

test('pause controls stop motion without navigation and survive resize', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Pause animation' }).click();
  const play = page.getByRole('button', { name: 'Play animation' });
  await expect(play).toBeVisible();
  const canvas = page.locator('.doubleclicc-player__canvas');
  const before = await canvas.screenshot();
  await page.waitForTimeout(250);
  expect(await canvas.screenshot()).toEqual(before);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(play).toBeVisible();
  const size = await canvas.boundingBox();
  expect(size!.width / size!.height).toBeCloseTo(3 / 4, 2);
  await play.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Pause animation' })).toBeVisible();
  expect(new URL(page.url()).hostname).toBe('127.0.0.1');
});

test('reduced motion keeps the static message and diagnostic links', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.locator('#doubleclicc-player').getByText('Less busywork.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pause animation' })).toHaveCount(0);
  await expect(page.locator('#doubleclicc-player a')).toHaveCount(2);
});

test('failed scene load keeps a readable fallback and link', async ({ page }) => {
  await page.route('**/assets/Intro-*.js', route => route.abort());
  await page.goto('./');
  await expect(page.locator('#doubleclicc-player').getByText('Less busywork.')).toBeVisible();
  await expect(page.locator('#doubleclicc-player').getByRole('link', { name: 'Run Revenue Diagnostic', exact: true })).toHaveAttribute('href', 'https://google.com/');
});

test('without JavaScript the static banner link is usable', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator('#player-fallback a')).toBeVisible();
  await expect(page.locator('#player-fallback a')).toHaveAttribute('href', 'https://google.com/');
  await context.close();
});
