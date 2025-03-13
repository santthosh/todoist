import { test, expect } from '@playwright/test';

test.describe('Theme Functionality', () => {
  test('should toggle between light and dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Check initial theme (default is light)
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    
    // Find and click the theme toggle button (the first one in the desktop navigation)
    const themeToggle = page.locator('[data-testid="flowbite-tooltip-target"]').locator('button[data-testid="dark-theme-toggle"]').first();
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();
    
    // Verify dark mode is enabled
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Toggle back to light mode
    await themeToggle.click();
    
    // Verify light mode is enabled
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });
}); 