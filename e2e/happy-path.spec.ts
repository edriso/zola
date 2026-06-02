import { expect, test } from '@playwright/test';

test('study together, finish, and see the togetherness count persist', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Zola' })).toBeVisible();

  // Pick 15 minutes and start.
  await page.getByRole('button', { name: '15 min' }).click();
  await page.getByRole('button', { name: 'Study together' }).click();
  await expect(page.getByText('15:00')).toBeVisible();

  // Run the whole session; Zola celebrates.
  await page.clock.runFor(15 * 60 * 1000);
  await expect(page.getByText(/We did it/)).toBeVisible();
  await expect(page.getByText('15 minutes', { exact: true })).toBeVisible();

  // Back to ready; the togetherness line shows we studied once.
  await page.getByRole('button', { name: 'Study again' }).click();
  await expect(page.getByText(/studied together/)).toBeVisible();

  // It survives a reload.
  await page.reload();
  await expect(page.getByText(/studied together/)).toBeVisible();
});

test('stepping away is met kindly, with no penalty', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Study together' }).click();

  // Simulate leaving and returning.
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });

  await expect(page.getByText(/kept your seat warm/)).toBeVisible();
  // Still studying — no broken state, no scold.
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
});
