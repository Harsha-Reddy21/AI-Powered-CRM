# Test info

- Name: Contact Management >> should delete contact
- Location: C:\Misogi\DAY3\AI-Powered-CRM\frontend\src\test\e2e\contacts.spec.ts:191:7

# Error details

```
Error: browserType.launch: Executable doesn't exist at C:\Users\harsh\AppData\Local\ms-playwright\firefox-1482\firefox\firefox.exe
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
  158 |     await page.route('**/api/contacts/1', async route => {
  159 |       if (route.request().method() === 'PUT') {
  160 |         await route.fulfill({
  161 |           status: 200,
  162 |           contentType: 'application/json',
  163 |           body: JSON.stringify({
  164 |             id: '1',
  165 |             first_name: 'John',
  166 |             last_name: 'Updated',
  167 |             email: 'john.updated@example.com',
  168 |             phone: '+1234567890',
  169 |             company: 'Updated Company',
  170 |             created_at: '2024-01-01T00:00:00Z',
  171 |           }),
  172 |         });
  173 |       }
  174 |     });
  175 |
  176 |     // Click edit button for first contact
  177 |     await page.click('[data-testid="edit-contact-1"]');
  178 |     
  179 |     await expect(page.locator('text=Edit Contact')).toBeVisible();
  180 |     
  181 |     // Update fields
  182 |     await page.fill('input[name="last_name"]', 'Updated');
  183 |     await page.fill('input[name="email"]', 'john.updated@example.com');
  184 |     await page.fill('input[name="company"]', 'Updated Company');
  185 |     
  186 |     await page.click('button:has-text("Update Contact")');
  187 |     
  188 |     await expect(page.locator('text=Contact updated successfully')).toBeVisible();
  189 |   });
  190 |
> 191 |   test('should delete contact', async ({ page }) => {
      |       ^ Error: browserType.launch: Executable doesn't exist at C:\Users\harsh\AppData\Local\ms-playwright\firefox-1482\firefox\firefox.exe
  192 |     // Mock delete contact API
  193 |     await page.route('**/api/contacts/1', async route => {
  194 |       if (route.request().method() === 'DELETE') {
  195 |         await route.fulfill({
  196 |           status: 200,
  197 |           contentType: 'application/json',
  198 |           body: JSON.stringify({ message: 'Contact deleted successfully' }),
  199 |         });
  200 |       }
  201 |     });
  202 |
  203 |     // Click delete button for first contact
  204 |     await page.click('[data-testid="delete-contact-1"]');
  205 |     
  206 |     // Confirm deletion
  207 |     await expect(page.locator('text=Are you sure you want to delete this contact?')).toBeVisible();
  208 |     await page.click('button:has-text("Delete")');
  209 |     
  210 |     await expect(page.locator('text=Contact deleted successfully')).toBeVisible();
  211 |   });
  212 |
  213 |   test('should handle pagination', async ({ page }) => {
  214 |     // Mock paginated response
  215 |     await page.route('**/api/contacts?page=2', async route => {
  216 |       await route.fulfill({
  217 |         status: 200,
  218 |         contentType: 'application/json',
  219 |         body: JSON.stringify({
  220 |           contacts: [
  221 |             {
  222 |               id: '3',
  223 |               first_name: 'Alice',
  224 |               last_name: 'Brown',
  225 |               email: 'alice@example.com',
  226 |               phone: '+5566778899',
  227 |               company: 'Another Company',
  228 |               created_at: '2024-01-03T00:00:00Z',
  229 |             },
  230 |           ],
  231 |           pagination: {
  232 |             page: 2,
  233 |             limit: 10,
  234 |             total: 3,
  235 |             totalPages: 2,
  236 |           },
  237 |         }),
  238 |       });
  239 |     });
  240 |
  241 |     // Click next page
  242 |     await page.click('button:has-text("Next")');
  243 |     
  244 |     await expect(page.locator('text=Alice Brown')).toBeVisible();
  245 |   });
  246 |
  247 |   test('should filter contacts by company', async ({ page }) => {
  248 |     // Mock filtered response
  249 |     await page.route('**/api/contacts?company=Test%20Company', async route => {
  250 |       await route.fulfill({
  251 |         status: 200,
  252 |         contentType: 'application/json',
  253 |         body: JSON.stringify({
  254 |           contacts: [
  255 |             {
  256 |               id: '1',
  257 |               first_name: 'John',
  258 |               last_name: 'Doe',
  259 |               email: 'john@example.com',
  260 |               phone: '+1234567890',
  261 |               company: 'Test Company',
  262 |               created_at: '2024-01-01T00:00:00Z',
  263 |             },
  264 |           ],
  265 |           pagination: {
  266 |             page: 1,
  267 |             limit: 10,
  268 |             total: 1,
  269 |             totalPages: 1,
  270 |           },
  271 |         }),
  272 |       });
  273 |     });
  274 |
  275 |     await page.selectOption('select[name="company"]', 'Test Company');
  276 |     
  277 |     await expect(page.locator('text=John Doe')).toBeVisible();
  278 |     await expect(page.locator('text=Jane Smith')).not.toBeVisible();
  279 |   });
  280 | }); 
```