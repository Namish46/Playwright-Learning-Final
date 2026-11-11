const { defineConfig, devices }=require('@playwright/test');

const edge={
  ...devices['Desktop Edge'],
  channel: 'msedge'
};

const shopTests=[
  '**/inventory/inventory.spec.js',
  '**/cart/cart.spec.js',
  '**/checkout/checkout.spec.js'
];

function shopProject(name, user) {
  return {
    name,
    testMatch: shopTests,
    metadata: { user },
    use: { ...edge }
  };
}

module.exports=defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  use: {
    baseURL: 'https://www.saucedemo.com',
    actionTimeout: 10 * 1000,
    navigationTimeout: 15 * 1000,
    headless: false,
    launchOptions: {
      slowMo: 700
    },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'login',
      testMatch: '**/auth/login.spec.js',
      use: { ...edge }
    },
    shopProject('standard-user', 'standard'),
    shopProject('problem-user', 'problem'),
    shopProject('performance-glitch-user', 'glitch'),
    shopProject('error-user', 'error'),
    shopProject('visual-user', 'visual')
  ],
  outputDir: 'test-results'
});
