import { BaseHooks } from "./base.hooks";
import { Deeplinks } from "../deeplinks/deeplinks";
import { LoginPage } from "../../test/login/login.page";

/**
 * LoginHooks — hooks specific to the Login page test suite.
 * Handles pre-conditions and cleanup for login tests.
 */
export class LoginHooks extends BaseHooks {
  private static loginPage = new LoginPage();

  static async beforeSuite(): Promise<void> {
    await super.beforeSuite();
    console.log("[LoginHooks] Preparing login test suite");
  }

  static async afterSuite(): Promise<void> {
    await super.afterSuite();
    console.log("[LoginHooks] Login test suite completed");
  }

  static async beforeTest(): Promise<void> {
    await super.beforeTest();
    await this.loginPage.navigateViaDeeplink(Deeplinks.login);
  }

  static async afterTest(): Promise<void> {
    await super.afterTest();
  }
}
