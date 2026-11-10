import { test, expect } from '@playwright/test';

for (const width of [390, 768, 1440]) {
  test(`deployment carousel reaches every app at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    const carousel = page.getByRole('region', { name: 'Deployment projects' });
    const cards = carousel.locator('.project-card');
    await expect(cards.locator('h3, .project-title')).toHaveText(['Syllabusy ↗', 'Unfold ↗', 'Smokesignal ↗', 'Sherwood ↗']);
    const previous = page.getByRole('button', { name: 'Previous deployments' });
    const next = page.getByRole('button', { name: 'Next deployments' });
    await expect(previous).toBeDisabled();
    for (let i = 0; i < 4; i++) {
      const { left, end } = await carousel.evaluate(el => ({ left: el.scrollLeft, end: el.scrollWidth - el.clientWidth }));
      if (left >= end - 1) break;
      await next.click();
      await expect.poll(() => carousel.evaluate(el => el.scrollLeft)).toBeGreaterThan(left);
    }
    await expect(next).toBeDisabled();
    const trackBounds = (await carousel.boundingBox())!;
    const lastBounds = (await cards.last().boundingBox())!;
    expect(lastBounds.x).toBeGreaterThanOrEqual(trackBounds.x);
    expect(lastBounds.x + lastBounds.width).toBeLessThanOrEqual(trackBounds.x + trackBounds.width + 1);
    await previous.click();
    await expect(next).toBeEnabled();
    await expect(page.getByRole('link', { name: 'Visit Smokesignal', exact: true })).toHaveAttribute('href', 'https://smokesignals-wgp5.onrender.com/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const width of [320, 768, 1440]) {
  test(`Unfold popup plays its film and stops on dismissal at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('./');
    const card = page.getByRole('button', { name: 'Watch the Unfold showcase' });
    await card.focus();
    await card.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'Unfold — Text in. Visual stories out.' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Private prototype', { exact: true })).toBeVisible();
    await expect(dialog.getByText('Unfold turns articles and pasted text into visual stories you can swipe, play, and export.')).toBeVisible();
    const close = dialog.getByRole('button', { name: 'Close Unfold showcase' });
    await expect(close).toBeFocused();
    const video = page.locator('#unfold-showcase video');
    expect(await video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
    await video.evaluate((el: HTMLVideoElement) => el.play());
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThan(0);
    expect(await video.evaluate((el: HTMLVideoElement) => el.duration)).toBeCloseTo(24, 0);
    const bounds = (await video.boundingBox())!;
    expect(bounds.width / bounds.height).toBeCloseTo(16 / 9, 2);
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    const closeBounds = (await close.boundingBox())!;
    expect(closeBounds.height).toBeGreaterThanOrEqual(44);
    expect(closeBounds.y).toBeGreaterThanOrEqual(0);
    expect(await dialog.locator('.modal__panel').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
    await expect(card).toBeFocused();
    await expect(page.locator('body')).not.toHaveClass(/showcase-is-open/);
    await card.press('Space');
    await expect(dialog).toBeVisible();
    await video.evaluate((el: HTMLVideoElement) => el.play());
    await close.click();
    await expect(card).toBeFocused();
    await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
  });
}

test('Unfold respects reduced motion and closes from the backdrop', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const card = page.getByRole('button', { name: 'Watch the Unfold showcase' });
  await card.click();
  const dialog = page.locator('#unfold-showcase');
  const video = page.locator('#unfold-showcase video');
  expect(await video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
  await expect(video).toHaveAttribute('poster', /deployments\/unfold\/poster.webp$/);
  await video.evaluate((el: HTMLVideoElement) => el.play());
  await page.mouse.click(5, 5);
  await expect(dialog).not.toBeVisible();
  await expect(card).toBeFocused();
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
});
