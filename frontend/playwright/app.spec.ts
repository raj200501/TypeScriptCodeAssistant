import { test, expect } from '@playwright/test';
import path from 'path';

const screenshotsDir = path.resolve(__dirname, '..', '..', 'docs', 'screenshots');

test('editor analysis and quick fix flow', async ({ page }) => {
  await page.goto('/editor');
  await page.getByRole('button', { name: 'Analyze' }).click();
  await expect(page.getByText('no-var')).toBeVisible();

  await page.screenshot({
    path: path.join(screenshotsDir, 'editor-analysis.png'),
    fullPage: true,
  });

  await page.getByRole('button', { name: 'Replace var with let' }).click();
  await expect(page.getByText('Quick Fix Preview')).toBeVisible();

  await page.screenshot({
    path: path.join(screenshotsDir, 'editor-quick-fix.png'),
    fullPage: true,
  });
});

test('snippets library and history', async ({ page }) => {
  await page.goto('/snippets');
  await page.getByRole('textbox', { name: 'Title' }).fill('Demo snippet');
  await page.getByText('Save').click();
  await expect(page.getByText('Demo snippet')).toBeVisible();

  await page.screenshot({
    path: path.join(screenshotsDir, 'snippets-library.png'),
    fullPage: true,
  });
});
