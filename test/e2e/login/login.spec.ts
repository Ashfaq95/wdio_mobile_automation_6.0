import { LoginPage } from "../../../src/pageObjects/actions/login.page";
import { Hooks } from "../../../config/hooks/hooks";
import { LoginMethods } from "../../../src/api/login/login-methods.api";
import { Deeplinks } from "../../../src/deeplinks/deeplinks";

const loginPage = new LoginPage();
const loginApi = new LoginMethods();

describe("Login Page Tests @login", () => {
  Hooks.register();

  // ──────────────────────────────────────────────
  // Each it block is independent and self-contained
  // ──────────────────────────────────────────────

  it("should display the login screen @smoke", async () => {
    const isDisplayed = await loginPage.isLoginButtonDisplayed();
    expect(isDisplayed).toBe(true);
  });

  it("should login with valid credentials @smoke", async () => {
    await loginPage.login("validuser", "validpass");
    // Validate via API that a token was issued
    const apiResponse = await loginApi.performLogin("validuser", "validpass");
    expect(apiResponse.token).toBeTruthy();
    expect(apiResponse.statusCode).toBe(200);
  });

  it("should show error for invalid credentials @regression", async () => {
    await loginPage.login("invaliduser", "wrongpass");
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain("Invalid");
  });

  it("should show error for empty username @regression", async () => {
    await loginPage.enterPasswordInput("somepass");
    await loginPage.clickLoginButton();
    const isError = await loginPage.isErrorMessageDisplayed();
    expect(isError).toBe(true);
  });

  it("should show error for empty password @regression", async () => {
    await loginPage.enterUsernameInput("someuser");
    await loginPage.clickLoginButton();
    const isError = await loginPage.isErrorMessageDisplayed();
    expect(isError).toBe(true);
  });

  it("should navigate to forgot password @regression", async () => {
    await loginPage.clickForgotPasswordLink();
    // Verify navigation happened — extend as needed
  });

  it("should navigate directly to forgot password via deeplink @regression", async () => {
    await loginPage.navigateViaDeeplink(Deeplinks.forgotPassword);
    // Verify forgot password screen is displayed — extend as needed
  });

  it("should validate login API response structure @api", async () => {
    const apiResponse = await loginApi.performLogin("validuser", "validpass");
    expect(apiResponse).toHaveProperty("token");
    expect(apiResponse).toHaveProperty("userId");
    expect(apiResponse).toHaveProperty("userName");
    expect(apiResponse).toHaveProperty("email");
    expect(apiResponse).toHaveProperty("expiresIn");
  });

  it("should validate token via API after login @api", async () => {
    const token = process.env.ACCESS_TOKEN || "";
    const isValid = await loginApi.validateToken(token);
    expect(isValid).toBe(true);
  });
});
