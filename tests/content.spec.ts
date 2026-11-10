import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`every Gray Paper opens the matching article and returns focus at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    const cards = page.locator('[data-open-paper]');
    await expect(cards).toHaveCount(3);
    for (const card of await cards.all()) {
      const title = await card.locator('.paper-card__title').innerText();
      await card.focus();
      await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog', { name: title, exact: true });
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'Close gray paper' })).toBeFocused();
      const bounds = (await dialog.boundingBox())!;
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      await dialog.locator('.modal__panel').evaluate(el => { el.scrollTop = el.scrollHeight; });
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      // The native dialog hides before its queued close handler finishes.
      // Wait for cleanup before reopening, so it cannot steal focus later.
      await expect(page.locator('body')).not.toHaveClass(/paper-is-open/);
      await expect(card).toBeFocused();
      await card.press('Enter');
      await expect(dialog).toBeVisible();
      await expect.poll(() => dialog.locator('.modal__panel').evaluate(el => el.scrollTop)).toBe(0);
      await dialog.getByRole('button', { name: 'Close gray paper' }).click();
      await expect(card).toBeFocused();
      await expect(page.locator('body')).not.toHaveClass(/paper-is-open/);
    }
  });
}

test('production page loads its assets without runtime errors', async ({ page, baseURL }) => {
  const errors: string[] = [];
  const origin = new URL(baseURL!).origin;
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (new URL(response.url()).origin === origin && response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  page.on('requestfailed', request => {
    if (new URL(request.url()).origin === origin) errors.push(`Failed: ${request.url()}`);
  });
  await page.goto('./');
  await expect(page.locator('.__remotion-player')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.client-grid')).toHaveCount(2);
  expect(errors).toEqual([]);
});

test('client marquee exposes one list and supports scrolling with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('./');
  const carousel = page.locator('#clientCarousel');
  await expect(carousel.getByRole('list')).toHaveCount(1);
  await expect(carousel.locator('.client-grid[aria-hidden="true"]')).toHaveAttribute('inert', '');
  await expect(carousel.locator('.client-carousel__track')).toHaveCSS('animation-name', 'none');
  await carousel.focus();
  await expect(carousel).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => carousel.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
});

for (const width of [320, 390, 768, 1440]) {
  test(`papers stay readable with reachable close controls at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('./');
    for (const id of ['paper-01', 'paper-02', 'paper-03']) {
      await page.locator(`[data-open-paper="${id}"]`).click();
      const dialog = page.locator(`#${id}`);
      const reader = dialog.locator('.paper-reader');
      const close = dialog.getByRole('button', { name: 'Close gray paper' });
      await reader.evaluate(el => { el.scrollTop = el.scrollHeight / 2; });
      const box = (await close.boundingBox())!;
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y + box.height).toBeLessThan(844);
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(await reader.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
      await close.click();
      await expect(dialog).not.toBeVisible();
    }
  });
}
