import { test, expect } from '@playwright/test';

test('built page loads player and local fonts', async ({ page, request }) => {
  const errors: string[] = [];
  const fontRequests: string[] = [];
  page.on('response', response => {
    if (response.url().endsWith('.ttf') && response.ok()) fontRequests.push(new URL(response.url()).pathname);
  });
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
  await expect.poll(() => new Set(fontRequests).size).toBe(3);
  for (const path of fontRequests) expect(path).toMatch(new RegExp(`^${process.env.SITE_BASE || '/'}fonts/`));
  expect(errors).toEqual([]);
});

for (const name of ['Run Revenue Diagnostic — animated banner', 'Run Revenue Diagnostic']) {
  for (const action of ['click', 'keyboard']) {
    test(`${name} opens Google in a new tab by ${action}`, async ({ page, context }) => {
      await context.route('https://google.com/**', route => route.fulfill({ body: 'Navigation reached Google' }));
      await page.goto('./');
      const link = page.locator('#doubleclicc-player').getByRole('link', { name, exact: true });
      await expect(link).toHaveAttribute('href', 'https://google.com/');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      const originalURL = page.url();
      const popupPromise = page.waitForEvent('popup');
      if (action === 'click') await link.click();
      else { await link.focus(); await page.keyboard.press('Enter'); }
      const popup = await popupPromise;
      await expect(popup).toHaveURL('https://google.com/');
      expect(await popup.evaluate(() => window.opener)).toBeNull();
      await expect(page).toHaveURL(originalURL);
      await popup.close();
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
  let sceneBlocked = false;
  await page.route('**/assets/Intro-*.js', route => { sceneBlocked = true; return route.abort(); });
  await page.goto('./');
  await expect(page.locator('#doubleclicc-player').getByText('Less busywork.')).toBeVisible();
  await expect.poll(() => sceneBlocked).toBe(true);
  await expect(page.locator('#doubleclicc-player').getByRole('link', { name: 'Run Revenue Diagnostic', exact: true })).toHaveAttribute('href', 'https://google.com/');
});

test('without JavaScript the static banner link is usable', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator('#player-fallback a')).toBeVisible();
  await expect(page.locator('#player-fallback a')).toHaveAttribute('href', 'https://google.com/');
  await expect(page.locator('#player-fallback a')).toHaveAttribute('target', '_blank');
  await expect(page.locator('#player-fallback a')).toHaveAttribute('rel', 'noopener noreferrer');
  await context.close();
});

test('retained navigation, dialogs, and client carousel remain usable', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator('#navStatus')).toHaveText('SECTION 02 / 06');
  await page.getByRole('link', { name: 'Clients', exact: true }).click();
  await expect(page).toHaveURL(/#clients$/);
  await expect(page.locator('#clientCarousel')).toHaveClass(/is-ready/);
  await expect(page.locator('#clientCarousel .client-grid:not([aria-hidden])')).toHaveCount(1);
  await page.getByRole('link', { name: 'Gray papers', exact: true }).click();
  await page.locator('[data-open-paper]').first().click();
  await expect(page.locator('dialog[open]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await page.locator('#siteHeader [data-open-diagnostic]').click();
  await expect(page.locator('#diagnosticModal')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#diagnosticModal')).not.toBeVisible();
});

for (const width of [360, 390, 1440]) {
  test(`page and player fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    await expect(page.getByRole('button', { name: 'Pause animation' })).toBeVisible();
    const canvas = await page.locator('.doubleclicc-player__canvas').boundingBox();
    expect(canvas!.width / canvas!.height).toBeCloseTo(width < 768 ? 3 / 4 : 16 / 9, 2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

for (const width of [390, 1440]) {
  test(`all five scenes play at ${width}px`, async ({ page }, testInfo) => {
    test.setTimeout(45000);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('./');
    const canvas = page.locator('.doubleclicc-player__canvas');
    const chapters = ['01 / FIND THE GAPS', '02 / TRACE THE FRICTION', '03 / CONNECT THE WORK', '04 / BUILT TO MAKE A DIFFERENCE', '05 / YOUR NEXT MOVE'];
    for (const [index, chapter] of chapters.entries()) {
      await expect(canvas.getByText(chapter, { exact: true })).toBeVisible({ timeout: 10000 });
      // Capture a settled point in each scene, beyond the transition/premount.
      await page.waitForTimeout(1800);
      await testInfo.attach(`scene-${index + 1}-${width}`, { body: await canvas.screenshot({ path: testInfo.outputPath(`scene-${index + 1}-${width}.png`) }), contentType: 'image/png' });
    }
  });
}
