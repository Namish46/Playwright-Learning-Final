const { test, expect }=require('@playwright/test');
const { LoginPage }=require('../../pages/LoginPage');
const { InventoryPage }=require('../../pages/InventoryPage');
const { ItemPage }=require('../../pages/ItemPage');
const { CartPage }=require('../../pages/CartPage');
const { users }=require('../../data/users');

let inventory;
let cart;
let itemPage;

test.beforeEach(async ({ page }, testInfo) => {
  const login=new LoginPage(page);
  inventory=new InventoryPage(page);
  cart=new CartPage(page);
  itemPage=new ItemPage(page);
  const user=users[testInfo.project.metadata.user];
  await login.open();
  await login.login(user.username, user.password);
});

test('empty cart', async () => {
  await cart.open();
  await expect(cart.title).toHaveText('Your Cart');
  await expect(cart.items).toHaveCount(0);
  await expect(cart.continueBtn).toBeVisible();
  await expect(cart.checkoutBtn).toBeVisible();
});

test('cart shows item name, desc, price and qty', async () => {
  await inventory.add('Sauce Labs Backpack');
  await cart.open();
  const item=cart.items.first();
  await expect(item.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
  await expect(item.locator('.inventory_item_desc')).not.toBeEmpty();
  await expect(item.locator('.inventory_item_price')).toHaveText('$29.99');
  await expect(item.locator('.cart_quantity')).toHaveText('1');
});

test('cart shows two items', async () => {
  await inventory.add('Sauce Labs Backpack');
  await inventory.add('Sauce Labs Bike Light');
  await cart.open();
  await expect(cart.items).toHaveCount(2);
  await expect(cart.cartBadge).toHaveText('2');
});

test('badge matches cart count after remove', async () => {
  await inventory.add('Sauce Labs Backpack');
  await inventory.add('Sauce Labs Bike Light');
  await cart.open();
  await cart.remove('Sauce Labs Backpack');
  await expect(cart.items).toHaveCount(1);
  await expect(cart.cartBadge).toHaveText('1');
});

test('remove last item leaves empty cart', async () => {
  await inventory.add('Sauce Labs Backpack');
  await cart.open();
  await cart.remove('Sauce Labs Backpack');
  await expect(cart.items).toHaveCount(0);
  await expect(cart.cartBadge).toHaveCount(0);
});

test('remove one item keeps the other', async () => {
  await inventory.add('Sauce Labs Backpack');
  await inventory.add('Sauce Labs Bike Light');
  await cart.open();
  await cart.remove('Sauce Labs Backpack');
  await expect(cart.items).toHaveCount(1);
  await expect(cart.items.first().locator('.inventory_item_name')).toHaveText('Sauce Labs Bike Light');
  await expect(cart.cartBadge).toHaveText('1');
});

test('badge updates on add and remove', async () => {
  await inventory.add('Sauce Labs Backpack');
  await expect(inventory.cartBadge).toHaveText('1');
  await inventory.add('Sauce Labs Bike Light');
  await expect(inventory.cartBadge).toHaveText('2');
  await inventory.remove('Sauce Labs Backpack');
  await expect(inventory.cartBadge).toHaveText('1');
  await inventory.remove('Sauce Labs Bike Light');
  await expect(inventory.cartBadge).toHaveCount(0);
});

test('continue shopping goes back to products', async () => {
  await inventory.add('Sauce Labs Backpack');
  await cart.open();
  await cart.continueShopping();
  await expect(inventory.title).toHaveText('Products');
  await expect(inventory.items).toHaveCount(6);
});

test('cart keeps items after continue shopping', async () => {
  await inventory.add('Sauce Labs Backpack');
  await cart.open();
  await cart.continueShopping();
  await cart.open();
  await expect(cart.items).toHaveCount(1);
  await expect(cart.items.first().locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
});

test('cart keeps items after refresh', async ({ page }) => {
  await inventory.add('Sauce Labs Backpack');
  await inventory.add('Sauce Labs Bike Light');
  await cart.open();
  await page.reload();
  await expect(cart.items).toHaveCount(2);
  await expect(cart.cartBadge).toHaveText('2');
});

test('empty cart stays empty after refresh', async ({ page }) => {
  await cart.open();
  await page.reload();
  await expect(cart.items).toHaveCount(0);
  await expect(cart.cartBadge).toHaveCount(0);
});

test('checkout opens info page', async ({ page }) => {
  await inventory.add('Sauce Labs Backpack');
  await cart.open();
  await cart.checkout();
  await expect(page).toHaveURL(/checkout-step-one\.html/);
});

test('checkout from empty cart', async ({ page }) => {
  await cart.open();
  await expect(cart.items).toHaveCount(0);
  await cart.checkout();
  await expect(page).toHaveURL(/checkout-step-one\.html/);
});

test('add from details then see it in cart', async () => {
  await inventory.openItem('Sauce Labs Backpack');
  await expect(itemPage.name).toHaveText('Sauce Labs Backpack');
  await itemPage.add();
  await expect(inventory.cartBadge).toHaveText('1');
  await cart.open();
  await expect(cart.items).toHaveCount(1);
  await expect(cart.items.first().locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
});
