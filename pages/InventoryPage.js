class InventoryPage {
  constructor(page) {
    this.page=page;
    this.title=page.locator('.title');
    this.items=page.locator('.inventory_item');
    this.sort=page.locator('[data-test="product-sort-container"]');
    this.cartLink=page.locator('.shopping_cart_link');
    this.cartBadge=page.locator('.shopping_cart_badge');
  }

  item(name) {
    return this.items.filter({ hasText: name });
  }

  async getNames() {
    return this.items.locator('.inventory_item_name').allTextContents();
  }

  async getPrices() {
    return this.items.locator('.inventory_item_price').allTextContents();
  }

  async sortBy(option) {
    await this.sort.selectOption(option);
  }

  async add(name) {
    await this.item(name).locator('button').click();
  }

  async addAll() {
    for (const item of await this.items.all()) {
      await item.locator('button').click();
    }
  }

  async remove(name) {
    await this.item(name).locator('button').click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async openItem(name) {
    await this.item(name).locator('.inventory_item_name').click();
  }

  async openItemImg(name) {
    await this.item(name).locator('.inventory_item_img img').click();
  }
}

module.exports={ InventoryPage };