import { BasePage } from "../../src/pages/base.page";
import { homeLocators } from "./home.locators";

export class HomePage extends BasePage {
  private locators = homeLocators;

  async getWelcomeText(): Promise<string> {
    return this.getText(await this.locators.welcomeText);
  }

  async isWelcomeTextDisplayed(): Promise<boolean> {
    return this.isDisplayed(await this.locators.welcomeText);
  }

  async tapProfileIcon(): Promise<void> {
    await this.tap(await this.locators.profileIcon);
  }

  async tapSettings(): Promise<void> {
    await this.tap(await this.locators.settingsButton);
  }

  async tapLogout(): Promise<void> {
    await this.tap(await this.locators.logoutButton);
  }

  async tapNotificationBell(): Promise<void> {
    await this.tap(await this.locators.notificationBell);
  }

  async tapSearchBar(): Promise<void> {
    await this.tap(await this.locators.searchBar);
  }

  async searchFor(query: string): Promise<void> {
    await this.tapSearchBar();
    await this.type(await this.locators.searchBar, query);
    await this.hideKeyboard();
  }

  async isProfileIconDisplayed(): Promise<boolean> {
    return this.isDisplayed(await this.locators.profileIcon);
  }
}
