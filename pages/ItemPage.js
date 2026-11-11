class ItemPage {
  constructor(page) {
    this.page=page;
    this.name=page.locator('.inventory_details_name');
    this.desc=page.locator('.inventory_details_desc');
    this.price=page.locator('.inventory_details_price');
    this.img=page.locator('.inventory_details_img');
    this.addBtn=page.locator('[data-test="add-to-cart"]');
    this.removeBtn=page.locator('[data-test="remove"]');
    this.backBtn=page.getByRole('button', { name: 'Back to products' });
  }

  async add() {
    await this.addBtn.click();
  }

  async remove() {
    await this.removeBtn.click();
  }

  async back() {
    await this.backBtn.click();
  }
}

module.exports={ ItemPage };
