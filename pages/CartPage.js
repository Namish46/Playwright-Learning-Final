class CartPage {
  constructor(page) {
    this.page=page;
    this.title=page.locator('.title');
    this.items=page.locator('.cart_item');
    this.continueBtn=page.locator('[data-test="continue-shopping"]');
    this.checkoutBtn=page.locator('[data-test="checkout"]');
    this.cartBadge=page.locator('.shopping_cart_badge');
  }

  async open() {
    await this.page.locator('.shopping_cart_link').click();
  }

  async getNames() {
    return this.items.locator('.inventory_item_name').allTextContents();
  }

  async remove(name) {
    await this.items.filter({ hasText: name }).locator('button').click();
  }

  async continueShopping() {
    await this.continueBtn.click();
  }

  async checkout() {
    await this.checkoutBtn.click();
  }
}

module.exports={ CartPage };
