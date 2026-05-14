import { HomePage } from "./home.page";
import { HomeHooks } from "../../src/hooks/home.hooks";
import userMethodsApi from "../../src/api/user/userMethods.api";
import { Deeplinks } from "../../src/deeplinks/deeplinks";

const homePage = new HomePage();

describe("Home Page Tests @home", () => {
  HomeHooks.register();

  // ──────────────────────────────────────────────
  // Each it block is independent and self-contained
  // ──────────────────────────────────────────────

  it("should display the home screen after login @smoke", async () => {
    const isDisplayed = await homePage.isWelcomeTextDisplayed();
    expect(isDisplayed).toBe(true);
  });

  it("should show correct welcome text @smoke", async () => {
    const text = await homePage.getWelcomeText();
    expect(text).toContain("Welcome");
  });

  it("should navigate to profile @regression", async () => {
    await homePage.tapProfileIcon();
    // Validate profile screen is displayed — extend as needed
  });

  it("should navigate directly to profile via deeplink @regression", async () => {
    await homePage.navigateViaDeeplink(Deeplinks.profile);
    // Validate profile screen is displayed — extend as needed
  });

  it("should navigate to settings @regression", async () => {
    await homePage.tapSettings();
    // Validate settings screen is displayed — extend as needed
  });

  it("should navigate directly to settings via deeplink @regression", async () => {
    await homePage.navigateViaDeeplink(Deeplinks.settings);
    // Validate settings screen is displayed — extend as needed
  });

  it("should open notifications @regression", async () => {
    await homePage.tapNotificationBell();
    // Validate notifications panel is displayed — extend as needed
  });

  it("should perform a search @regression", async () => {
    await homePage.searchFor("test query");
    // Validate search results — extend as needed
  });

  it("should validate user profile via API @api", async () => {
    const testUserId = process.env.TEST_USER_ID || "12345";
    const profile = await userMethodsApi.getUserProfile(testUserId);
    expect(profile.userId).toBe(testUserId);
    expect(profile.userName).toBeTruthy();
    expect(profile.email).toBeTruthy();
  });

  it("should logout successfully @regression", async () => {
    await homePage.tapLogout();
    // After logout, login screen should appear — extend as needed
  });
});
