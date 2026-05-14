/**
 * BaseHooks — common setup/teardown shared across all test suites.
 * Import and wire into any spec's before/after/beforeEach/afterEach.
 */
export class BaseHooks {
  /**
   * Register all mocha hooks for this suite in one call.
   */
  static register(): void {
    before(async () => {
      await this.beforeSuite();
    });

    after(async () => {
      await this.afterSuite();
    });

    beforeEach(async () => {
      await this.beforeTest();
    });

    afterEach(async () => {
      await this.afterTest();
    });
  }

  static async beforeSuite(): Promise<void> {
    console.log(
      `[BaseHooks] Suite starting on platform: ${driver.isAndroid ? "Android" : "iOS"}`,
    );

    // ACCESS_TOKEN is auto-loaded by getDefaultHeaders() in api.helper
  }

  static async afterSuite(): Promise<void> {
    console.log("[BaseHooks] Suite finished");
  }

  static async beforeTest(): Promise<void> {
    // Ensure app is in foreground before every test
    const bundleOrPackage = driver.isAndroid
      ? (driver.capabilities as Record<string, string>)["appPackage"]
      : (driver.capabilities as Record<string, string>)["bundleId"];

    if (bundleOrPackage) {
      await driver.activateApp(bundleOrPackage);
    }
  }

  static async afterTest(): Promise<void> {
    // Take screenshot on failure — handled in wdio.conf afterTest hook as well
  }
}
