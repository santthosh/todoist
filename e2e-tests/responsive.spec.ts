import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('should display mobile navigation on small screens', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Verify the mobile menu button is visible
    const mobileMenuButton = page.locator('button[data-testid="flowbite-navbar-toggle"]');
    await expect(mobileMenuButton).toBeVisible();
    
    // Verify desktop navigation is hidden
    const desktopNav = page.locator('nav').locator('.hidden.md\\:flex');
    await expect(desktopNav).not.toBeVisible();
    
    // Open mobile menu
    await mobileMenuButton.click();
    
    // Verify mobile menu items are visible
    const mobileMenu = page.locator('[data-testid="flowbite-navbar-collapse"]');
    await expect(mobileMenu).toBeVisible();
    await expect(mobileMenu.getByRole('link', { name: 'Home' })).toBeVisible();
  });
  
  test('should display desktop navigation on large screens', async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    
    // Verify the mobile menu button is hidden
    const mobileMenuButton = page.locator('button[data-testid="flowbite-navbar-toggle"]');
    await expect(mobileMenuButton).not.toBeVisible();
    
    // Verify desktop navigation is visible
    const desktopNav = page.locator('nav').locator('.hidden.md\\:flex');
    await expect(desktopNav).toBeVisible();
    
    // Verify desktop menu items are visible
    const homeLink = desktopNav.getByRole('link', { name: 'Home' });
    await expect(homeLink).toBeVisible();
  });
}); 