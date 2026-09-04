import { test, expect } from '@playwright/test';

test.describe('DealLink smoke tests', () => {
  test('landing page renders the story', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: /Creators meet brands/i })
    ).toBeVisible();
    await expect(page.getByText('Scroll to see how')).toBeVisible();
    await expect(page.getByText('Two sides. One gap.')).toBeVisible();
  });

  test('login page renders form', async ({ page }) => {
    await page.goto('/creator/login');
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Log in to dashboard/i })
    ).toBeVisible();
  });

  test('signup wizard renders step 1', async ({ page }) => {
    await page.goto('/creator/signup');
    await expect(page.getByText('Step 1 of 3')).toBeVisible();
    await expect(page.getByLabel('Full name')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Continue/i })
    ).toBeVisible();
  });

  test('business apply renders step 1', async ({ page }) => {
    await page.goto('/business/apply');
    await expect(page.getByText('Step 1 of 2')).toBeVisible();
    await expect(page.getByLabel('Your name')).toBeVisible();
  });

  test('marketplace page loads', async ({ page }) => {
    await page.goto('/marketplace');
    await expect(
      page.getByRole('heading', { name: /creators/i }).first()
    ).toBeVisible();
    await expect(page.getByPlaceholder('Search creators, niches...')).toBeVisible();
  });

  test('legal pages render', async ({ page }) => {
    await page.goto('/legal/privacy');
    await expect(
      page.getByRole('heading', { name: 'Privacy Policy' })
    ).toBeVisible();
    await page.goto('/legal/terms');
    await expect(
      page.getByRole('heading', { name: 'Terms of Service' })
    ).toBeVisible();
  });

  test('admin portal shows passcode gate', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByText('Admin portal')).toBeVisible();
    await expect(page.getByLabel(/Admin passcode/i)).toBeVisible();
  });

  test('sitemap and robots exist', async ({ request }) => {
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain('Disallow');
  });
});
