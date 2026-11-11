const { test, expect }=require('@playwright/test');
const { LoginPage }=require('../../pages/LoginPage');
const { users }=require('../../data/users');

let login;

test.beforeEach(async ({ page }) => {
  login=new LoginPage(page);
  await login.open();
});

test('login page shows logo and form', async () => {
  await expect(login.logo).toHaveText('Swag Labs');
  await expect(login.username).toBeVisible();
  await expect(login.password).toBeVisible();
  await expect(login.loginBtn).toBeVisible();
});

test('password is masked', async () => {
  await login.password.fill(users.standard.password);
  await expect(login.password).toHaveAttribute('type', 'password');
});

test('standard user login', async ({ page }) => {
  await login.login(users.standard.username, users.standard.password);
  await expect(page).toHaveURL(/inventory.html/);
});

test('wrong username and password', async () => {
  await login.login(users.invalid.username, users.invalid.password);
  await expect(login.error).toContainText('Username and password do not match');
});

test('wrong username', async () => {
  await login.login(users.badUser.username, users.badUser.password);
  await expect(login.error).toContainText('Username and password do not match');
});

test('wrong password', async () => {
  await login.login(users.badPass.username, users.badPass.password);
  await expect(login.error).toContainText('Username and password do not match');
});

test('empty username and password', async () => {
  await login.login('', '');
  await expect(login.error).toContainText('Username is required');
});

test('empty username', async () => {
  await login.login('', users.standard.password);
  await expect(login.error).toContainText('Username is required');
});

test('empty password', async () => {
  await login.login(users.standard.username, '');
  await expect(login.error).toContainText('Password is required');
});

test('locked out user', async () => {
  await login.login(users.locked.username, users.locked.password);
  await expect(login.error).toContainText('locked out');
});

test('close error message', async () => {
  await login.login(users.invalid.username, users.invalid.password);
  await expect(login.error).toBeVisible();
  await login.closeError();
  await expect(login.error).toBeHidden();
});

test('logout and cannot reopen inventory', async ({ page }) => {
  await login.login(users.standard.username, users.standard.password);
  await expect(page).toHaveURL(/inventory.html/);
  await login.logout();
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(login.loginBtn).toBeVisible();
  await page.goto('/inventory.html');
  await expect(login.loginBtn).toBeVisible();
});
