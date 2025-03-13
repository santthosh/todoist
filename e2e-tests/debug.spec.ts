import { test, expect } from '@playwright/test';

test.describe('Debug Tests', () => {
  test('should create a list and navigate to it', async ({ page }) => {
    await page.goto('/');
    
    // Generate a unique list name
    const listName = `Debug List ${Date.now()}`;
    
    // Click the "New List" button
    await page.getByRole('button', { name: /New List/i }).click();
    
    // Fill in the list name
    await page.getByLabel('Title').fill(listName);
    
    // Submit the form
    await page.getByRole('button', { name: /Create List/i }).click();
    
    // Wait for the list to be created and visible
    await expect(page.getByText(listName)).toBeVisible();
    
    // Take a screenshot before clicking
    await page.screenshot({ path: 'before-click.png' });
    
    // Click on the list
    await page.getByText(listName).click();
    
    // Take a screenshot after clicking
    await page.screenshot({ path: 'after-click.png' });
    
    // Wait a bit and take another screenshot
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'after-wait.png' });
    
    // Log the current URL
    console.log('Current URL:', page.url());
    
    // Log the page content
    const content = await page.content();
    console.log('Page content length:', content.length);
    console.log('Page content snippet:', content.substring(0, 500));
  });
}); 