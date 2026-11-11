class CheckoutPage {
  constructor(page) {
    this.page=page;
    this.firstName=page.locator('[data-test="firstName"]');
    this.lastName=page.locator('[data-test="lastName"]');
    this.zip=page.locator('[data-test="postalCode"]');
    this.continueBtn=page.locator('[data-test="continue"]');
    this.cancelBtn=page.locator('[data-test="cancel"]');
    this.error=page.locator('[data-test="error"]');
    this.errorClose=page.locator('[data-test="error-button"]');
    this.items=page.locator('.cart_item');
    this.summary=page.locator('.summary_info');
    this.subtotal=page.locator('.summary_subtotal_label');
    this.tax=page.locator('.summary_tax_label');
    this.total=page.locator('.summary_total_label');
    this.finishBtn=page.locator('[data-test="finish"]');
    this.backHomeBtn=page.locator('[data-test="back-to-products"]');
    this.header=page.locator('.complete-header');
    this.msg=page.locator('.complete-text');
  }

  async fillInfo(first, last, zip) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.zip.fill(zip);
  }

  async continue() {
    await this.continueBtn.click();
  }

  async cancel() {
    await this.cancelBtn.click();
  }

  async finish() {
    await this.finishBtn.click();
  }

  async backHome() {
    await this.backHomeBtn.click();
  }

  async closeError() {
    await this.errorClose.click();
  }
}

module.exports={ CheckoutPage };
