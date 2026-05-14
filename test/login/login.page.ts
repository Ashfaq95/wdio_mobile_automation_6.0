import { BasePage } from "../../src/pages/base.page";
import { loginLocators } from "./login.locators";

export class LoginPage extends BasePage {
  private locators = loginLocators;

  async enterUsername(username: string): Promise<void> {
    await this.type(await this.locators.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.type(await this.locators.passwordInput, password);
  }

  async tapLoginButton(): Promise<void> {
    await this.hideKeyboard();
    await this.tap(await this.locators.loginButton);
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.tapLoginButton();
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(await this.locators.errorMessage);
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    return this.isDisplayed(await this.locators.errorMessage);
  }

  async tapForgotPassword(): Promise<void> {
    await this.tap(await this.locators.forgotPasswordLink);
  }

  async isLoginButtonDisplayed(): Promise<boolean> {
    return this.isDisplayed(await this.locators.loginButton);
  }
}
