import { BasePage } from "./base.page";
import { loginLocators } from "../locators/login.locators";

export class LoginPage extends BasePage {
  private locators = loginLocators;

  async enterUsernameInput(username: string): Promise<void> {
    await this.type(await this.locators.usernameInput, username);
  }

  async enterPasswordInput(password: string): Promise<void> {
    await this.type(await this.locators.passwordInput, password);
  }

  async clickLoginButton(): Promise<void> {
    await this.hideKeyboard();
    await this.tap(await this.locators.loginButton);
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsernameInput(username);
    await this.enterPasswordInput(password);
    await this.clickLoginButton();
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(await this.locators.errorMessage);
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    return this.isDisplayed(await this.locators.errorMessage);
  }

  async clickForgotPasswordLink(): Promise<void> {
    await this.tap(await this.locators.forgotPasswordLink);
  }

  async isLoginButtonDisplayed(): Promise<boolean> {
    return this.isDisplayed(await this.locators.loginButton);
  }
}
