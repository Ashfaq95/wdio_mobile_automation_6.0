import { getCurrentPlatform } from "../../utils/app.helper";

class LoginObjects {
  get usernameInput() {
    return $("");
  }
  get passwordInput() {
    return $("");
  }
  get loginButton() {
    return $("");
  }
  get errorMessage() {
    return $("");
  }
  get forgotPasswordLink() {
    return $("");
  }
}

class LoginAndroidObjects extends LoginObjects {
  get usernameInput() {
    return $(
      'android=new UiSelector().resourceId("com.app.package:id/username_input")',
    );
  }
  get passwordInput() {
    return $(
      'android=new UiSelector().resourceId("com.app.package:id/password_input")',
    );
  }
  get loginButton() {
    return $(
      'android=new UiSelector().resourceId("com.app.package:id/login_button")',
    );
  }
  get errorMessage() {
    return $(
      'android=new UiSelector().resourceId("com.app.package:id/error_message")',
    );
  }
  get forgotPasswordLink() {
    return $(
      'android=new UiSelector().resourceId("com.app.package:id/forgot_password")',
    );
  }
}

class LoginIOSObjects extends LoginObjects {
  get usernameInput() {
    return $('-ios predicate string:name == "username_input"');
  }
  get passwordInput() {
    return $('-ios predicate string:name == "password_input"');
  }
  get loginButton() {
    return $('-ios predicate string:name == "login_button"');
  }
  get errorMessage() {
    return $('-ios predicate string:name == "error_message"');
  }
  get forgotPasswordLink() {
    return $('-ios predicate string:name == "forgot_password"');
  }
}

export const loginLocators: LoginObjects =
  getCurrentPlatform() === "android"
    ? new LoginAndroidObjects()
    : new LoginIOSObjects();
