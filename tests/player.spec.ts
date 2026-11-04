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
  await expect(page.locator('.doubleclicc-player__canvas').getByText('01 / FIND THE GAPS', { exact: true })).toBeVisible();
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
    test(`${name} opens the consultation form by ${action}`, async ({ page }) => {
      await page.goto('./');
      const link = page.locator('#doubleclicc-player').getByRole('button', { name, exact: true });
      const originalURL = page.url();
      if (action === 'click') await link.click();
      else { await link.focus(); await page.keyboard.press('Enter'); }
      await expect(page.locator('#diagnosticModal')).toBeVisible();
      await expect(page).toHaveURL(originalURL);
    });
  }
}

test('hero keeps a centered CTA without manual playback controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const host = page.locator('#doubleclicc-player');
  await expect(host.getByText('01 / FIND THE GAPS', { exact: true })).toBeVisible();
  await expect(host.getByRole('button')).toHaveCount(2);
  const hero = await host.boundingBox();
  const cta = await host.getByRole('button', { name: 'Run Revenue Diagnostic', exact: true }).boundingBox();
  expect(cta!.x + cta!.width / 2).toBeCloseTo(hero!.x + hero!.width / 2, 0);
});

test('reduced motion keeps the static message and diagnostic links', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.locator('#doubleclicc-player').getByText('Less busywork.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pause animation' })).toHaveCount(0);
  await expect(page.locator('#doubleclicc-player button')).toHaveCount(2);
});

test('failed scene load keeps a readable fallback and link', async ({ page }) => {
  let sceneBlocked = false;
  await page.route('**/assets/Intro-*.js', route => { sceneBlocked = true; return route.abort(); });
  await page.goto('./');
  await expect(page.locator('#doubleclicc-player').getByText('Less busywork.')).toBeVisible();
  await expect.poll(() => sceneBlocked).toBe(true);
  await page.locator('#doubleclicc-player').getByRole('button', { name: 'Run Revenue Diagnostic', exact: true }).click();
  await expect(page.locator('#diagnosticModal')).toBeVisible();
});

test('without JavaScript the static banner explains how to send a request', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.getByText('Please enable JavaScript to send a consultation request.')).toBeVisible();
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
    await expect(page.locator('.doubleclicc-player__canvas').getByText('01 / FIND THE GAPS', { exact: true })).toBeVisible();
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
