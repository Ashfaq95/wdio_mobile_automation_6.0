import { BasePage } from "./base.page";
import { homeLocators } from "../locators/home.locators";

export class HomePage extends BasePage {
  private locators = homeLocators;

  async getWelcomeText(): Promise<string> {
    return this.getText(await this.locators.welcomeText);
  }

  async isWelcomeTextDisplayed(): Promise<boolean> {
    return this.isDisplayed(await this.locators.welcomeText);
  }

  async clickProfileIcon(): Promise<void> {
    await this.tap(await this.locators.profileIcon);
  }

  async clickSettingsButton(): Promise<void> {
    await this.tap(await this.locators.settingsButton);
  }

  async clickLogoutButton(): Promise<void> {
    await this.tap(await this.locators.logoutButton);
  }

  async clickNotificationBell(): Promise<void> {
    await this.tap(await this.locators.notificationBell);
  }

  async clickSearchBar(): Promise<void> {
    await this.tap(await this.locators.searchBar);
  }

  async searchFor(query: string): Promise<void> {
    await this.clickSearchBar();
    await this.type(await this.locators.searchBar, query);
    await this.hideKeyboard();
  }

  async isProfileIconDisplayed(): Promise<boolean> {
    return this.isDisplayed(await this.locators.profileIcon);
  }
}
