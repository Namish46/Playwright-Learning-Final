const { test, expect }=require('@playwright/test');
const { LoginPage }=require('../../pages/LoginPage');
const { InventoryPage }=require('../../pages/InventoryPage');
const { ItemPage }=require('../../pages/ItemPage');
const { users }=require('../../data/users');

let inventory;
let itemPage;

test.beforeEach(async ({ page }, testInfo) => {
  const login=new LoginPage(page);
  inventory=new InventoryPage(page);
  itemPage=new ItemPage(page);
  const user=users[testInfo.project.metadata.user];
  await login.open();
  await login.login(user.username, user.password);
});

test('products page loads with 6 items', async () => {
  await expect(inventory.title).toHaveText('Products');
  await expect(inventory.items).toHaveCount(6);
});

test('item shows name, desc, price and image', async () => {
  const item=inventory.items.first();
  await expect(item.locator('.inventory_item_name')).toBeVisible();
  await expect(item.locator('.inventory_item_desc')).toBeVisible();
  await expect(item.locator('.inventory_item_price')).toBeVisible();
  await expect(item.locator('.inventory_item_img img')).toBeVisible();
});

test('sort A to Z', async () => {
  await inventory.sortBy('az');
  const names=await inventory.getNames();
  expect(names).toEqual([...names].sort());
});

test('sort Z to A', async () => {
  await inventory.sortBy('za');
  const names=await inventory.getNames();
  expect(names).toEqual([...names].sort().reverse());
});

test('sort price low to high', async () => {
  await inventory.sortBy('lohi');
  const prices=(await inventory.getPrices()).map(p => Number(p.replace('$', '')));
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});

test('sort price high to low', async () => {
  await inventory.sortBy('hilo');
  const prices=(await inventory.getPrices()).map(p => Number(p.replace('$', '')));
  expect(prices).toEqual([...prices].sort((a, b) => b - a));
});

test('add one item to cart', async () => {
  await inventory.add('Sauce Labs Backpack');
  await expect(inventory.cartBadge).toHaveText('1');
});

test('add two items to cart', async () => {
  await inventory.add('Sauce Labs Backpack');
  await inventory.add('Sauce Labs Bike Light');
  await expect(inventory.cartBadge).toHaveText('2');
});

test('add all 6 products', async () => {
  await inventory.addAll();
  await expect(inventory.cartBadge).toHaveText('6');
});

test('remove item from inventory', async () => {
  await inventory.add('Sauce Labs Backpack');
  await inventory.remove('Sauce Labs Backpack');
  await expect(inventory.cartBadge).toHaveCount(0);
});

test('open item details', async ({ page }) => {
  await inventory.openItem('Sauce Labs Backpack');
  await expect(page).toHaveURL(/inventory-item.html/);
  await expect(itemPage.name).toHaveText('Sauce Labs Backpack');
});

test('open item from image', async ({ page }) => {
  await inventory.openItemImg('Sauce Labs Backpack');
  await expect(page).toHaveURL(/inventory-item.html/);
  await expect(itemPage.name).toHaveText('Sauce Labs Backpack');
});

test('details page shows desc, price and image', async () => {
  await inventory.openItem('Sauce Labs Backpack');
  await expect(itemPage.desc).not.toBeEmpty();
  await expect(itemPage.price).toBeVisible();
  await expect(itemPage.img).toBeVisible();
});

test('details match the list item', async () => {
  const item=inventory.item('Sauce Labs Backpack');
  const name=(await item.locator('.inventory_item_name').textContent()).trim();
  const desc=(await item.locator('.inventory_item_desc').textContent()).trim();
  const price=(await item.locator('.inventory_item_price').textContent()).trim();
  await inventory.openItem('Sauce Labs Backpack');
  await expect(itemPage.name).toHaveText(name);
  await expect(itemPage.desc).toHaveText(desc);
  await expect(itemPage.price).toHaveText(price);
});

test('add from details page', async () => {
  await inventory.openItem('Sauce Labs Backpack');
  await itemPage.add();
  await expect(inventory.cartBadge).toHaveText('1');
  await expect(itemPage.removeBtn).toBeVisible();
});

test('remove from details page', async () => {
  await inventory.openItem('Sauce Labs Backpack');
  await itemPage.add();
  await itemPage.remove();
  await expect(inventory.cartBadge).toHaveCount(0);
  await expect(itemPage.addBtn).toBeVisible();
});

test('back to products from details', async ({ page }) => {
  await inventory.openItem('Sauce Labs Backpack');
  await itemPage.back();
  await expect(page).toHaveURL(/inventory.html/);
  await expect(inventory.items).toHaveCount(6);
});

test('default sort is A to Z', async () => {
  const names=await inventory.getNames();
  expect(names).toEqual([...names].sort());
});
