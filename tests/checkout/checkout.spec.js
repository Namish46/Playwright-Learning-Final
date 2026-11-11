const { test, expect }=require('@playwright/test');
const { LoginPage }=require('../../pages/LoginPage');
const { InventoryPage }=require('../../pages/InventoryPage');
const { CartPage }=require('../../pages/CartPage');
const { CheckoutPage }=require('../../pages/CheckoutPage');
const { users }=require('../../data/users');

let inventory;
let cart;
let checkout;

test.beforeEach(async ({ page }, testInfo) => {
  const login=new LoginPage(page);
  inventory=new InventoryPage(page);
  cart=new CartPage(page);
  checkout=new CheckoutPage(page);
  const user=users[testInfo.project.metadata.user];
  await login.open();
  await login.login(user.username, user.password);
  await inventory.add('Sauce Labs Backpack');
  await cart.open();
  await cart.checkout();
});

test('checkout info page shows fields', async () => {
  await expect(checkout.firstName).toBeVisible();
  await expect(checkout.lastName).toBeVisible();
  await expect(checkout.zip).toBeVisible();
  await expect(checkout.continueBtn).toBeVisible();
  await expect(checkout.cancelBtn).toBeVisible();
});

test('cannot continue with empty fields', async () => {
  await checkout.continue();
  await expect(checkout.error).toContainText('First Name is required');
});

test('first name required', async () => {
  await checkout.fillInfo('', 'Tester', '570001');
  await checkout.continue();
  await expect(checkout.error).toContainText('First Name is required');
});

test('last name required', async () => {
  await checkout.fillInfo('Test', '', '570001');
  await checkout.continue();
  await expect(checkout.error).toContainText('Last Name is required');
});

test('zip required', async () => {
  await checkout.fillInfo('Test', 'User', '');
  await checkout.continue();
  await expect(checkout.error).toContainText('Postal Code is required');
});

test('close error message', async () => {
  await checkout.continue();
  await checkout.closeError();
  await expect(checkout.error).toBeHidden();
});

test('cancel from info goes to cart', async ({ page }) => {
  await checkout.cancel();
  await expect(page).toHaveURL(/cart\.html/);
  await expect(cart.items).toHaveCount(1);
});

test('valid info opens overview', async ({ page }) => {
  await checkout.fillInfo('Test', 'User', '570001');
  await checkout.continue();
  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await expect(inventory.title).toHaveText('Checkout: Overview');
});

test('overview shows selected item', async () => {
  await checkout.fillInfo('Test', 'User', '570001');
  await checkout.continue();
  await expect(checkout.items).toHaveCount(1);
  await expect(checkout.items.first().locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
  await expect(checkout.items.first().locator('.cart_quantity')).toHaveText('1');
  await expect(checkout.items.first().locator('.inventory_item_price')).toHaveText('$29.99');
});

test('overview shows payment and shipping', async () => {
  await checkout.fillInfo('Test', 'User', '570001');
  await checkout.continue();
  await expect(checkout.summary).toContainText('Payment Information');
  await expect(checkout.summary).toContainText('Shipping Information');
});

test('overview totals for one item', async () => {
  await checkout.fillInfo('Test', 'User', '570001');
  await checkout.continue();
  await expect(checkout.subtotal).toHaveText('Item total: $29.99');
  await expect(checkout.tax).toHaveText('Tax: $2.40');
  await expect(checkout.total).toHaveText('Total: $32.39');
});

test('cancel from overview goes to products', async ({ page }) => {
  await checkout.fillInfo('Test', 'User', '570001');
  await checkout.continue();
  await checkout.cancel();
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventory.title).toHaveText('Products');
});

test('finish completes the order', async ({ page }) => {
  await checkout.fillInfo('Test', 'User', '570001');
  await checkout.continue();
  await checkout.finish();
  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(checkout.header).toHaveText('Thank you for your order!');
  await expect(checkout.msg).toContainText('Your order has been dispatched');
});

test('back home after order', async ({ page }) => {
  await checkout.fillInfo('Test', 'User', '570001');
  await checkout.continue();
  await checkout.finish();
  await checkout.backHome();
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventory.title).toHaveText('Products');
});

test('completed order clears the cart', async () => {
  await checkout.fillInfo('Test', 'User', '570001');
  await checkout.continue();
  await checkout.finish();
  await checkout.backHome();
  await cart.open();
  await expect(cart.items).toHaveCount(0);
  await expect(cart.cartBadge).toHaveCount(0);
});

test('totals for two items', async () => {
  await checkout.cancel();
  await cart.continueShopping();
  await inventory.add('Sauce Labs Bike Light');
  await cart.open();
  await cart.checkout();
  await checkout.fillInfo('Test', 'User', '570001');
  await checkout.continue();
  await expect(checkout.items).toHaveCount(2);
  await expect(checkout.subtotal).toHaveText('Item total: $39.98');
  await expect(checkout.tax).toHaveText('Tax: $3.20');
  await expect(checkout.total).toHaveText('Total: $43.18');
});

test('two items listed on overview', async () => {
  await checkout.cancel();
  await cart.continueShopping();
  await inventory.add('Sauce Labs Bike Light');
  await cart.open();
  await cart.checkout();
  await checkout.fillInfo('Test', 'User', '570001');
  await checkout.continue();
  await expect(checkout.items.filter({ hasText: 'Sauce Labs Backpack' })).toHaveCount(1);
  await expect(checkout.items.filter({ hasText: 'Sauce Labs Bike Light' })).toHaveCount(1);
});
