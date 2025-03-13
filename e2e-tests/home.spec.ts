import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page successfully', async ({ page }) => {
    await page.goto('/');
    
    // Verify the page title
    await expect(page).toHaveTitle(/todoist.cloud/);
    
    // Verify the navbar contains the logo and title
    const navbar = page.locator('nav');
    await expect(navbar.getByText('todoist.cloud')).toBeVisible();
    
    // Verify the "New List" button is visible
    await expect(page.getByRole('button', { name: /New List/i })).toBeVisible();
  });
  
  test('should display the create list modal when button is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Click the "New List" button
    await page.getByRole('button', { name: /New List/i }).click();
    
    // Verify the modal appears
    const form = page.locator('form');
    await expect(form.getByText('Create new todo list')).toBeVisible();
    
    // Close the modal
    await page.getByRole('button', { name: /Cancel/i }).click();
    await expect(form).not.toBeVisible();
  });
}); 