class LoginPage {
  constructor(page) {
    this.page=page;
    this.username=page.locator('[data-test="username"]');
    this.password=page.locator('[data-test="password"]');
    this.loginBtn=page.locator('[data-test="login-button"]');
    this.error=page.locator('[data-test="error"]');
    this.errorClose=page.locator('[data-test="error-button"]');
    this.logo=page.locator('.login_logo');
    this.menuBtn=page.locator('#react-burger-menu-btn');
    this.logoutLink=page.locator('[data-test="logout-sidebar-link"]');
  }

  async open() {
    await this.page.goto('/');
  }

  async login(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginBtn.click();
  }

  async closeError() {
    await this.errorClose.click();
  }

  async logout() {
    await this.menuBtn.click();
    await this.logoutLink.click();
  }
}

module.exports={ LoginPage };
