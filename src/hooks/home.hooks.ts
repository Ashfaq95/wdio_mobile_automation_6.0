import { BaseHooks } from "./base.hooks";
import { Deeplinks } from "../deeplinks/deeplinks";
import { LoginPage } from "../../test/login/login.page";
import { HomePage } from "../../test/home/home.page";

/**
 * HomeHooks — hooks specific to the Home page test suite.
 * Ensures user is logged in before each home-page test.
 */
export class HomeHooks extends BaseHooks {
  private static loginPage = new LoginPage();
  private static homePage = new HomePage();

  static async beforeSuite(): Promise<void> {
    await super.beforeSuite();
    console.log("[HomeHooks] Preparing home test suite");
  }

  static async afterSuite(): Promise<void> {
    await super.afterSuite();
    console.log("[HomeHooks] Home test suite completed");
  }

  static async beforeTest(): Promise<void> {
    await super.beforeTest();
    await this.loginPage.navigateViaDeeplink(Deeplinks.login);
    await this.loginPage.login(
      process.env.TEST_USERNAME || "testuser",
      process.env.TEST_PASSWORD || "testpass",
    );
    await this.homePage.navigateViaDeeplink(Deeplinks.home);
  }

  static async afterTest(): Promise<void> {
    await super.afterTest();
  }
}
