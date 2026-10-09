import { test, expect } from '@playwright/test';

test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'], args: ['--disable-features=OverlayScrollbar'] } });

for (const width of [360, 390]) {
  test(`mobile menu overlays without moving the banner at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('./');
    await expect(page.getByRole('button', { name: 'Pause animation', exact: true })).toBeVisible();
    const toggle = page.getByRole('button', { name: 'Open menu', exact: true });
    await expect(toggle).toBeVisible();
    const header = await page.locator('#siteHeader').boundingBox();
    expect(header!.height).toBeLessThan(85);
    await expect(page.getByRole('link', { name: 'Work', exact: true })).not.toBeVisible();
    const before = await page.locator('.hero__banner').boundingBox();
    expect(before!.y).toBeGreaterThan(header!.height);
    await toggle.click();
    await expect(page.getByRole('button', { name: 'Close menu', exact: true })).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: 'Work', exact: true })).toBeVisible();
    expect(await page.locator('.hero__banner').boundingBox()).toEqual(before);
    await expect(page.getByRole('button', { name: 'Play animation', exact: true })).toBeDisabled();
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
    await expect(page.getByRole('button', { name: 'Pause animation', exact: true })).toBeVisible();
    await toggle.click();
    await page.locator('.menu-backdrop').click({ position: { x: 10, y: 600 } });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(new URL(page.url()).hostname).toBe('127.0.0.1');
  });
}

test('mobile menu preserves a manual pause and closes on navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.getByRole('button', { name: 'Pause animation', exact: true }).click();
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await page.getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('button', { name: 'Play animation', exact: true })).toBeEnabled();
  await page.getByRole('link', { name: 'Doubleclicc home' }).click();
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await page.getByRole('button', { name: 'Close menu', exact: true }).click();
  const canvas = page.locator('.doubleclicc-player__canvas');
  const frame = await canvas.screenshot();
  await page.waitForTimeout(250);
  expect(await canvas.screenshot()).toEqual(frame);
});

test('mobile menu works in landscape and resets on desktop resize', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('./');
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  const panel = await page.locator('#headerMenu').boundingBox();
  expect(panel!.y + panel!.height).toBeLessThanOrEqual(390);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('#menuToggle')).not.toBeVisible();
  await expect(page.locator('.menu-backdrop')).not.toBeVisible();
  await expect(page.getByRole('link', { name: 'Work', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pause animation', exact: true })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toHaveAttribute('aria-expanded', 'false');
});

test('mobile menu supports keyboard navigation and diagnostic dialog', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const toggle = page.getByRole('button', { name: 'Open menu', exact: true });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Work', exact: true })).toBeFocused();
  await page.locator('#siteHeader [data-open-diagnostic]').click();
  await expect(page.locator('#diagnosticModal')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('menu open before player load prevents autoplay until dismissal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  let release!: () => void;
  const ready = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/assets/DoublecliccPlayer-*.js', async route => { await ready; await route.continue(); });
  await page.goto('./', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  release();
  await expect(page.getByRole('button', { name: 'Play animation', exact: true })).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Pause animation', exact: true })).toBeVisible();
});

test.describe('classic scrollbars', () => {
  test('opening the menu preserves the player width with a visible scrollbar', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 844 });
    await page.goto('./');
    await expect(page.getByRole('button', { name: 'Pause animation', exact: true })).toBeVisible();
    expect(await page.evaluate(() => innerWidth - document.documentElement.clientWidth)).toBeGreaterThan(0);
    const canvas = page.locator('.doubleclicc-player__canvas');
    const before = await canvas.boundingBox();
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    expect(await canvas.boundingBox()).toEqual(before);
  });
});

test('mobile navigation remains available without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator('#menuToggle')).not.toBeVisible();
  await page.getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await context.close();
});
