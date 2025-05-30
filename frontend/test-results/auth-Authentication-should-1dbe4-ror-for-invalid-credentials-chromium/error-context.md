# Test info

- Name: Authentication >> should show error for invalid credentials
- Location: C:\Misogi\DAY3\AI-Powered-CRM\frontend\src\test\e2e\auth.spec.ts:24:7

# Error details

```
Error: browserType.launch: Executable doesn't exist at C:\Users\harsh\AppData\Local\ms-playwright\chromium_headless_shell-1169\chrome-win\headless_shell.exe
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║     npx playwright install                                              ║
║                                                                         ║
║ <3 Playwright Team                                                      ║
╚═════════════════════════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Authentication', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Navigate to the login page
   6 |     await page.goto('/login');
   7 |   });
   8 |
   9 |   test('should display login form', async ({ page }) => {
   10 |     await expect(page.locator('h1')).toContainText('Sign In');
   11 |     await expect(page.locator('input[type="email"]')).toBeVisible();
   12 |     await expect(page.locator('input[type="password"]')).toBeVisible();
   13 |     await expect(page.locator('button[type="submit"]')).toBeVisible();
   14 |   });
   15 |
   16 |   test('should show validation errors for empty form', async ({ page }) => {
   17 |     await page.click('button[type="submit"]');
   18 |     
   19 |     // Check for validation messages
   20 |     await expect(page.locator('text=Email is required')).toBeVisible();
   21 |     await expect(page.locator('text=Password is required')).toBeVisible();
   22 |   });
   23 |
>  24 |   test('should show error for invalid credentials', async ({ page }) => {
      |       ^ Error: browserType.launch: Executable doesn't exist at C:\Users\harsh\AppData\Local\ms-playwright\chromium_headless_shell-1169\chrome-win\headless_shell.exe
   25 |     await page.fill('input[type="email"]', 'invalid@example.com');
   26 |     await page.fill('input[type="password"]', 'wrongpassword');
   27 |     await page.click('button[type="submit"]');
   28 |     
   29 |     await expect(page.locator('text=Invalid credentials')).toBeVisible();
   30 |   });
   31 |
   32 |   test('should login successfully with valid credentials', async ({ page }) => {
   33 |     // Mock successful login
   34 |     await page.route('**/auth/login', async route => {
   35 |       await route.fulfill({
   36 |         status: 200,
   37 |         contentType: 'application/json',
   38 |         body: JSON.stringify({
   39 |           user: { id: '1', email: 'test@example.com', name: 'Test User' },
   40 |           token: 'mock-token',
   41 |         }),
   42 |       });
   43 |     });
   44 |
   45 |     await page.fill('input[type="email"]', 'test@example.com');
   46 |     await page.fill('input[type="password"]', 'password123');
   47 |     await page.click('button[type="submit"]');
   48 |     
   49 |     // Should redirect to dashboard
   50 |     await expect(page).toHaveURL('/dashboard');
   51 |     await expect(page.locator('text=Welcome back')).toBeVisible();
   52 |   });
   53 |
   54 |   test('should logout successfully', async ({ page }) => {
   55 |     // First login
   56 |     await page.route('**/auth/login', async route => {
   57 |       await route.fulfill({
   58 |         status: 200,
   59 |         contentType: 'application/json',
   60 |         body: JSON.stringify({
   61 |           user: { id: '1', email: 'test@example.com', name: 'Test User' },
   62 |           token: 'mock-token',
   63 |         }),
   64 |       });
   65 |     });
   66 |
   67 |     await page.fill('input[type="email"]', 'test@example.com');
   68 |     await page.fill('input[type="password"]', 'password123');
   69 |     await page.click('button[type="submit"]');
   70 |     
   71 |     // Wait for dashboard
   72 |     await expect(page).toHaveURL('/dashboard');
   73 |     
   74 |     // Logout
   75 |     await page.click('[data-testid="user-menu"]');
   76 |     await page.click('text=Logout');
   77 |     
   78 |     // Should redirect to login
   79 |     await expect(page).toHaveURL('/login');
   80 |   });
   81 |
   82 |   test('should redirect to login when accessing protected route', async ({ page }) => {
   83 |     await page.goto('/dashboard');
   84 |     await expect(page).toHaveURL('/login');
   85 |   });
   86 |
   87 |   test('should remember login state after page refresh', async ({ page }) => {
   88 |     // Mock successful login
   89 |     await page.route('**/auth/login', async route => {
   90 |       await route.fulfill({
   91 |         status: 200,
   92 |         contentType: 'application/json',
   93 |         body: JSON.stringify({
   94 |           user: { id: '1', email: 'test@example.com', name: 'Test User' },
   95 |           token: 'mock-token',
   96 |         }),
   97 |       });
   98 |     });
   99 |
  100 |     await page.fill('input[type="email"]', 'test@example.com');
  101 |     await page.fill('input[type="password"]', 'password123');
  102 |     await page.click('button[type="submit"]');
  103 |     
  104 |     await expect(page).toHaveURL('/dashboard');
  105 |     
  106 |     // Refresh page
  107 |     await page.reload();
  108 |     
  109 |     // Should still be on dashboard
  110 |     await expect(page).toHaveURL('/dashboard');
  111 |   });
  112 | }); 
```