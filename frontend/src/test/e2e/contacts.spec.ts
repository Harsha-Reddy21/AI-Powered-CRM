import { test, expect } from '@playwright/test';

test.describe('Contact Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.route('**/auth/verify', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: '1', email: 'test@example.com', name: 'Test User' },
        }),
      });
    });

    // Mock contacts API
    await page.route('**/api/contacts', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            contacts: [
              {
                id: '1',
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                phone: '+1234567890',
                company: 'Test Company',
                created_at: '2024-01-01T00:00:00Z',
              },
              {
                id: '2',
                first_name: 'Jane',
                last_name: 'Smith',
                email: 'jane@example.com',
                phone: '+0987654321',
                company: 'Test Corp',
                created_at: '2024-01-02T00:00:00Z',
              },
            ],
            pagination: {
              page: 1,
              limit: 10,
              total: 2,
              totalPages: 1,
            },
          }),
        });
      }
    });

    await page.goto('/contacts');
  });

  test('should display contacts list', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Contacts');
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=Jane Smith')).toBeVisible();
    await expect(page.locator('text=john@example.com')).toBeVisible();
    await expect(page.locator('text=Test Company')).toBeVisible();
  });

  test('should open create contact modal', async ({ page }) => {
    await page.click('button:has-text("Add Contact")');
    
    await expect(page.locator('text=Create New Contact')).toBeVisible();
    await expect(page.locator('input[name="first_name"]')).toBeVisible();
    await expect(page.locator('input[name="last_name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="company"]')).toBeVisible();
  });

  test('should create new contact', async ({ page }) => {
    // Mock create contact API
    await page.route('**/api/contacts', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '3',
            first_name: 'Bob',
            last_name: 'Johnson',
            email: 'bob@example.com',
            phone: '+1122334455',
            company: 'New Company',
            created_at: '2024-01-03T00:00:00Z',
          }),
        });
      }
    });

    await page.click('button:has-text("Add Contact")');
    
    // Fill form
    await page.fill('input[name="first_name"]', 'Bob');
    await page.fill('input[name="last_name"]', 'Johnson');
    await page.fill('input[name="email"]', 'bob@example.com');
    await page.fill('input[name="phone"]', '+1122334455');
    await page.fill('input[name="company"]', 'New Company');
    
    await page.click('button:has-text("Create Contact")');
    
    // Should close modal and show success message
    await expect(page.locator('text=Create New Contact')).not.toBeVisible();
    await expect(page.locator('text=Contact created successfully')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('button:has-text("Add Contact")');
    await page.click('button:has-text("Create Contact")');
    
    await expect(page.locator('text=First name is required')).toBeVisible();
    await expect(page.locator('text=Last name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('should search contacts', async ({ page }) => {
    // Mock search API
    await page.route('**/api/contacts?search=john', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          contacts: [
            {
              id: '1',
              first_name: 'John',
              last_name: 'Doe',
              email: 'john@example.com',
              phone: '+1234567890',
              company: 'Test Company',
              created_at: '2024-01-01T00:00:00Z',
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
          },
        }),
      });
    });

    await page.fill('input[placeholder="Search contacts..."]', 'john');
    await page.press('input[placeholder="Search contacts..."]', 'Enter');
    
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=Jane Smith')).not.toBeVisible();
  });

  test('should edit contact', async ({ page }) => {
    // Mock update contact API
    await page.route('**/api/contacts/1', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '1',
            first_name: 'John',
            last_name: 'Updated',
            email: 'john.updated@example.com',
            phone: '+1234567890',
            company: 'Updated Company',
            created_at: '2024-01-01T00:00:00Z',
          }),
        });
      }
    });

    // Click edit button for first contact
    await page.click('[data-testid="edit-contact-1"]');
    
    await expect(page.locator('text=Edit Contact')).toBeVisible();
    
    // Update fields
    await page.fill('input[name="last_name"]', 'Updated');
    await page.fill('input[name="email"]', 'john.updated@example.com');
    await page.fill('input[name="company"]', 'Updated Company');
    
    await page.click('button:has-text("Update Contact")');
    
    await expect(page.locator('text=Contact updated successfully')).toBeVisible();
  });

  test('should delete contact', async ({ page }) => {
    // Mock delete contact API
    await page.route('**/api/contacts/1', async route => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Contact deleted successfully' }),
        });
      }
    });

    // Click delete button for first contact
    await page.click('[data-testid="delete-contact-1"]');
    
    // Confirm deletion
    await expect(page.locator('text=Are you sure you want to delete this contact?')).toBeVisible();
    await page.click('button:has-text("Delete")');
    
    await expect(page.locator('text=Contact deleted successfully')).toBeVisible();
  });

  test('should handle pagination', async ({ page }) => {
    // Mock paginated response
    await page.route('**/api/contacts?page=2', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          contacts: [
            {
              id: '3',
              first_name: 'Alice',
              last_name: 'Brown',
              email: 'alice@example.com',
              phone: '+5566778899',
              company: 'Another Company',
              created_at: '2024-01-03T00:00:00Z',
            },
          ],
          pagination: {
            page: 2,
            limit: 10,
            total: 3,
            totalPages: 2,
          },
        }),
      });
    });

    // Click next page
    await page.click('button:has-text("Next")');
    
    await expect(page.locator('text=Alice Brown')).toBeVisible();
  });

  test('should filter contacts by company', async ({ page }) => {
    // Mock filtered response
    await page.route('**/api/contacts?company=Test%20Company', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          contacts: [
            {
              id: '1',
              first_name: 'John',
              last_name: 'Doe',
              email: 'john@example.com',
              phone: '+1234567890',
              company: 'Test Company',
              created_at: '2024-01-01T00:00:00Z',
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
          },
        }),
      });
    });

    await page.selectOption('select[name="company"]', 'Test Company');
    
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=Jane Smith')).not.toBeVisible();
  });
}); 