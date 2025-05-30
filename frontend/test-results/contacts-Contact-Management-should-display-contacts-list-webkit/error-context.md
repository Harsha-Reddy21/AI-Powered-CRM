# Test info

- Name: Contact Management >> should display contacts list
- Location: C:\Misogi\DAY3\AI-Powered-CRM\frontend\src\test\e2e\contacts.spec.ts:57:7

# Error details

```
Error: browserType.launch: Executable doesn't exist at C:\Users\harsh\AppData\Local\ms-playwright\webkit-2158\Playwright.exe
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
   3 | test.describe('Contact Management', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Mock authentication
   6 |     await page.route('**/auth/verify', async route => {
   7 |       await route.fulfill({
   8 |         status: 200,
   9 |         contentType: 'application/json',
   10 |         body: JSON.stringify({
   11 |           user: { id: '1', email: 'test@example.com', name: 'Test User' },
   12 |         }),
   13 |       });
   14 |     });
   15 |
   16 |     // Mock contacts API
   17 |     await page.route('**/api/contacts', async route => {
   18 |       if (route.request().method() === 'GET') {
   19 |         await route.fulfill({
   20 |           status: 200,
   21 |           contentType: 'application/json',
   22 |           body: JSON.stringify({
   23 |             contacts: [
   24 |               {
   25 |                 id: '1',
   26 |                 first_name: 'John',
   27 |                 last_name: 'Doe',
   28 |                 email: 'john@example.com',
   29 |                 phone: '+1234567890',
   30 |                 company: 'Test Company',
   31 |                 created_at: '2024-01-01T00:00:00Z',
   32 |               },
   33 |               {
   34 |                 id: '2',
   35 |                 first_name: 'Jane',
   36 |                 last_name: 'Smith',
   37 |                 email: 'jane@example.com',
   38 |                 phone: '+0987654321',
   39 |                 company: 'Test Corp',
   40 |                 created_at: '2024-01-02T00:00:00Z',
   41 |               },
   42 |             ],
   43 |             pagination: {
   44 |               page: 1,
   45 |               limit: 10,
   46 |               total: 2,
   47 |               totalPages: 1,
   48 |             },
   49 |           }),
   50 |         });
   51 |       }
   52 |     });
   53 |
   54 |     await page.goto('/contacts');
   55 |   });
   56 |
>  57 |   test('should display contacts list', async ({ page }) => {
      |       ^ Error: browserType.launch: Executable doesn't exist at C:\Users\harsh\AppData\Local\ms-playwright\webkit-2158\Playwright.exe
   58 |     await expect(page.locator('h1')).toContainText('Contacts');
   59 |     await expect(page.locator('text=John Doe')).toBeVisible();
   60 |     await expect(page.locator('text=Jane Smith')).toBeVisible();
   61 |     await expect(page.locator('text=john@example.com')).toBeVisible();
   62 |     await expect(page.locator('text=Test Company')).toBeVisible();
   63 |   });
   64 |
   65 |   test('should open create contact modal', async ({ page }) => {
   66 |     await page.click('button:has-text("Add Contact")');
   67 |     
   68 |     await expect(page.locator('text=Create New Contact')).toBeVisible();
   69 |     await expect(page.locator('input[name="first_name"]')).toBeVisible();
   70 |     await expect(page.locator('input[name="last_name"]')).toBeVisible();
   71 |     await expect(page.locator('input[name="email"]')).toBeVisible();
   72 |     await expect(page.locator('input[name="phone"]')).toBeVisible();
   73 |     await expect(page.locator('input[name="company"]')).toBeVisible();
   74 |   });
   75 |
   76 |   test('should create new contact', async ({ page }) => {
   77 |     // Mock create contact API
   78 |     await page.route('**/api/contacts', async route => {
   79 |       if (route.request().method() === 'POST') {
   80 |         await route.fulfill({
   81 |           status: 201,
   82 |           contentType: 'application/json',
   83 |           body: JSON.stringify({
   84 |             id: '3',
   85 |             first_name: 'Bob',
   86 |             last_name: 'Johnson',
   87 |             email: 'bob@example.com',
   88 |             phone: '+1122334455',
   89 |             company: 'New Company',
   90 |             created_at: '2024-01-03T00:00:00Z',
   91 |           }),
   92 |         });
   93 |       }
   94 |     });
   95 |
   96 |     await page.click('button:has-text("Add Contact")');
   97 |     
   98 |     // Fill form
   99 |     await page.fill('input[name="first_name"]', 'Bob');
  100 |     await page.fill('input[name="last_name"]', 'Johnson');
  101 |     await page.fill('input[name="email"]', 'bob@example.com');
  102 |     await page.fill('input[name="phone"]', '+1122334455');
  103 |     await page.fill('input[name="company"]', 'New Company');
  104 |     
  105 |     await page.click('button:has-text("Create Contact")');
  106 |     
  107 |     // Should close modal and show success message
  108 |     await expect(page.locator('text=Create New Contact')).not.toBeVisible();
  109 |     await expect(page.locator('text=Contact created successfully')).toBeVisible();
  110 |   });
  111 |
  112 |   test('should validate required fields', async ({ page }) => {
  113 |     await page.click('button:has-text("Add Contact")');
  114 |     await page.click('button:has-text("Create Contact")');
  115 |     
  116 |     await expect(page.locator('text=First name is required')).toBeVisible();
  117 |     await expect(page.locator('text=Last name is required')).toBeVisible();
  118 |     await expect(page.locator('text=Email is required')).toBeVisible();
  119 |   });
  120 |
  121 |   test('should search contacts', async ({ page }) => {
  122 |     // Mock search API
  123 |     await page.route('**/api/contacts?search=john', async route => {
  124 |       await route.fulfill({
  125 |         status: 200,
  126 |         contentType: 'application/json',
  127 |         body: JSON.stringify({
  128 |           contacts: [
  129 |             {
  130 |               id: '1',
  131 |               first_name: 'John',
  132 |               last_name: 'Doe',
  133 |               email: 'john@example.com',
  134 |               phone: '+1234567890',
  135 |               company: 'Test Company',
  136 |               created_at: '2024-01-01T00:00:00Z',
  137 |             },
  138 |           ],
  139 |           pagination: {
  140 |             page: 1,
  141 |             limit: 10,
  142 |             total: 1,
  143 |             totalPages: 1,
  144 |           },
  145 |         }),
  146 |       });
  147 |     });
  148 |
  149 |     await page.fill('input[placeholder="Search contacts..."]', 'john');
  150 |     await page.press('input[placeholder="Search contacts..."]', 'Enter');
  151 |     
  152 |     await expect(page.locator('text=John Doe')).toBeVisible();
  153 |     await expect(page.locator('text=Jane Smith')).not.toBeVisible();
  154 |   });
  155 |
  156 |   test('should edit contact', async ({ page }) => {
  157 |     // Mock update contact API
```