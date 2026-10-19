import { test, expect } from '@playwright/test';

test('smoke: app loads without build errors', async ({ browser }) => {
  const ctx = await browser.newContext({
    extraHTTPHeaders: { 'RPC-Service': 'vibe-mcp' },
  });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (
      msg.type() === 'error' &&
      !msg.text().includes('CORS') &&
      !msg.text().includes('ERR_FAILED') &&
      !msg.text().includes('favicon')
    ) {
      errors.push(msg.text().substring(0, 300));
    }
  });
  await page.goto('/v-staging-1/family-emergency-handbook/');
  await page.waitForTimeout(10000);
  const errorVisible = await page.locator('#error').isVisible().catch(() => false);
  if (errorVisible) {
    console.log('BUILD ERROR:', await page.locator('#error').textContent());
  }
  expect(errorVisible, 'esbuild error overlay visible').toBeFalsy();
  expect(await page.locator('#root').textContent()).not.toContain('Build failed');
  expect(errors, 'Console errors').toHaveLength(0);
  await expect(page.getByTestId('count-wizard')).toBeVisible();
  await ctx.close();
});
