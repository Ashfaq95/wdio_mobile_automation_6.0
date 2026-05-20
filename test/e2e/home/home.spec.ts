import { HomePage } from "../../../src/pageObjects/actions/home.page";
import { Hooks } from "../../../config/hooks/hooks";
import userMethodsApi from "../../../src/api/user/user-methods.api";
import { Deeplinks } from "../../../src/deeplinks/deeplinks";

const homePage = new HomePage();

describe("Home Page Tests @home", () => {
  Hooks.register();

  beforeEach(async () => {
    // Ensure the user is logged in before each home test
    await Hooks.login();
    await homePage.navigateViaDeeplink(Deeplinks.home);
  });

  // ──────────────────────────────────────────────────────────────────────
  // FLOW 1: Home Screen Landing & UI Verification
  // Verifies the app lands correctly after login and displays expected UI
  // ──────────────────────────────────────────────────────────────────────
  it("should land on the home screen and display correct UI after login @smoke", async () => {
    // Step 1: Verify home screen is shown
    const isDisplayed = await homePage.isWelcomeTextDisplayed();
    expect(isDisplayed).toBe(true);

    // Step 2: Verify welcome text content
    const text = await homePage.getWelcomeText();
    expect(text).toContain("Welcome");
  });

  // ──────────────────────────────────────────────────────────────────────
  // FLOW 2: Profile Navigation (UI tap + Deeplink)
  // Verifies the user can reach the profile screen via two entry points
  // ──────────────────────────────────────────────────────────────────────
  it("should navigate to profile via tap and deeplink @regression", async () => {
    // Step 1: Navigate to profile using the UI icon
    await homePage.clickProfileIcon();
    // Validate profile screen is displayed — extend as needed

    // Step 2: Navigate to profile via deeplink
    await homePage.navigateViaDeeplink(Deeplinks.profile);
    // Validate profile screen is displayed — extend as needed
  });

  // ──────────────────────────────────────────────────────────────────────
  // FLOW 3: Settings Navigation (UI tap + Deeplink)
  // Verifies the user can reach the settings screen via two entry points
  // ──────────────────────────────────────────────────────────────────────
  it("should navigate to settings via tap and deeplink @regression", async () => {
    // Step 1: Navigate to settings using the UI control
    await homePage.clickSettingsButton();
    // Validate settings screen is displayed — extend as needed

    // Step 2: Navigate to settings via deeplink
    await homePage.navigateViaDeeplink(Deeplinks.settings);
    // Validate settings screen is displayed — extend as needed
  });

  // ──────────────────────────────────────────────────────────────────────
  // FLOW 4: Engagement Features (Notifications + Search)
  // Verifies core interactive features available from the home screen
  // ──────────────────────────────────────────────────────────────────────
  it("should open notifications and perform a search from the home screen @regression", async () => {
    // Step 1: Open notifications panel
    await homePage.clickNotificationBell();
    // Validate notifications panel is displayed — extend as needed

    // Step 2: Perform a search query
    await homePage.searchFor("test query");
    // Validate search results — extend as needed
  });

  // ──────────────────────────────────────────────────────────────────────
  // FLOW 5: API + Logout
  // Validates user data integrity via API then confirms clean logout
  // ──────────────────────────────────────────────────────────────────────
  it("should validate user profile via API and logout successfully @api @regression", async () => {
    // Step 1: Validate user profile fields through the API
    const testUserId = process.env.TEST_USER_ID || "12345";
    const profile = await userMethodsApi.getUserProfile(testUserId);
    expect(profile.userId).toBe(testUserId);
    expect(profile.userName).toBeTruthy();
    expect(profile.email).toBeTruthy();

    // Step 2: Perform logout and verify return to login screen
    await homePage.clickLogoutButton();
    // After logout, login screen should appear — extend as needed
  });
});
