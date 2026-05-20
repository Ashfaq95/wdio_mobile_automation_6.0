import { LoginPage } from "../src/pageObjects/actions/login.page";
import { Deeplinks } from "../src/deeplinks/deeplinks";

/**
 * Hooks — centralised before/after lifecycle and shared utility actions.
 *
 * Register once at the top of each spec's describe block:
 *   Hooks.register();
 *
 * For suites that need the user already logged in, call Hooks.login()
 * inside a beforeEach:
 *   beforeEach(async () => { await Hooks.login(); });
 */
export class Hooks {
  // ─────────────────────────────────────────
  // Lifecycle registration
  // ─────────────────────────────────────────

  static register(): void {
    before(async () => {
      await this.launchApp();
    });

    after(async () => {
      await this.onSuiteEnd();
    });

    beforeEach(async () => {
      await this.beforeTest();
    });

    afterEach(async () => {
      await this.afterTest();
    });
  }

  // ─────────────────────────────────────────
  // Lifecycle handlers
  // ─────────────────────────────────────────

  static async launchApp(): Promise<void> {
    const platform = driver.isAndroid ? "Android" : "iOS";
    console.log(`[Hooks] Launching app on ${platform}`);

    const appId = driver.isAndroid
      ? (driver.capabilities as Record<string, string>)["appPackage"]
      : (driver.capabilities as Record<string, string>)["bundleId"];

    if (appId) {
      await driver.activateApp(appId);
    }
  }

  static async beforeTest(): Promise<void> {
    // Ensure the app is in the foreground before every test
    const appId = driver.isAndroid
      ? (driver.capabilities as Record<string, string>)["appPackage"]
      : (driver.capabilities as Record<string, string>)["bundleId"];

    if (appId) {
      await driver.activateApp(appId);
    }
  }

  static async afterTest(): Promise<void> {
    // Screenshots on failure are captured by the afterTest hook in wdio.conf.ts
  }

  static async onSuiteEnd(): Promise<void> {
    console.log(
      "[Hooks] Suite complete. Run `npm run allure:report` to view results.",
    );
  }

  // ─────────────────────────────────────────
  // Shared utility actions
  // ─────────────────────────────────────────

  /**
   * Navigate to the login screen and perform a full login.
   * Call in beforeEach for suites that require an authenticated session.
   */
  static async login(username?: string, password?: string): Promise<void> {
    const loginPage = new LoginPage();
    await loginPage.navigateViaDeeplink(Deeplinks.login);
    await loginPage.login(
      username ?? process.env.TEST_USERNAME ?? "testuser",
      password ?? process.env.TEST_PASSWORD ?? "testpass",
    );
  }

  /**
   * Scroll the screen vertically.
   * @param direction - "down" (default) scrolls content upward; "up" scrolls content downward
   */
  static async scrollVertical(direction: "down" | "up" = "down"): Promise<void> {
    const { width, height } = await driver.getWindowSize();

    if (direction === "down") {
      await driver.touchPerform([
        { action: "press",  options: { x: width / 2, y: height * 0.8 } },
        { action: "wait",   options: { ms: 500 } },
        { action: "moveTo", options: { x: width / 2, y: height * 0.2 } },
        { action: "release", options: {} },
      ]);
    } else {
      await driver.touchPerform([
        { action: "press",  options: { x: width / 2, y: height * 0.2 } },
        { action: "wait",   options: { ms: 500 } },
        { action: "moveTo", options: { x: width / 2, y: height * 0.8 } },
        { action: "release", options: {} },
      ]);
    }
  }

  /**
   * Scroll the screen horizontally.
   * @param direction - "left" (default) swipes content toward the left; "right" swipes right
   */
  static async scrollHorizontal(direction: "left" | "right" = "left"): Promise<void> {
    const { width, height } = await driver.getWindowSize();

    if (direction === "left") {
      await driver.touchPerform([
        { action: "press",  options: { x: width * 0.8, y: height / 2 } },
        { action: "wait",   options: { ms: 500 } },
        { action: "moveTo", options: { x: width * 0.2, y: height / 2 } },
        { action: "release", options: {} },
      ]);
    } else {
      await driver.touchPerform([
        { action: "press",  options: { x: width * 0.2, y: height / 2 } },
        { action: "wait",   options: { ms: 500 } },
        { action: "moveTo", options: { x: width * 0.8, y: height / 2 } },
        { action: "release", options: {} },
      ]);
    }
  }
}
