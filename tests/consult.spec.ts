import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`Google Form loads on opening and fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('https://docs.google.com/forms/**', route => route.fulfill({body: '<p>Google Form preview</p>', contentType: 'text/html'}));
    await page.goto('./');
    const frame = page.locator('#consultForm');
    await expect(frame).not.toHaveAttribute('src');
    await page.locator('#doubleclicc-player').getByRole('button', { name: 'Run Revenue Diagnostic', exact: true }).click();
    await expect(frame).toBeVisible();
    await expect(frame).toHaveAttribute('src', /1FAIpQLScjGxCXYk3uXb-pPHe3bmg7evwx4cmcSfSi_GACiFMihTk0eA\/viewform\?embedded=true$/);
    await expect(frame).toHaveAttribute('title', 'Consultation request form');
    const rect = (await frame.boundingBox())!;
    expect(rect.width).toBeGreaterThan(250);
    expect(rect.x + rect.width).toBeLessThanOrEqual(width);
    await expect(page.getByRole('link', { name: 'Open form in a new tab' })).toHaveAttribute('rel', 'noopener noreferrer');
    await page.locator('[data-close-diagnostic]').click();
    await expect(page.locator('#diagnosticModal')).not.toBeVisible();
    await page.locator('#doubleclicc-player').getByRole('button', { name: 'Run Revenue Diagnostic', exact: true }).click();
    await expect(frame).toHaveAttribute('src', /embedded=true$/);
  });
}
