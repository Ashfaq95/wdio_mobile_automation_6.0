import { getCurrentPlatform } from "../../utils/app.helper";

class HomeObjects {
  get welcomeText() {
    return $("");
  }
  get profileIcon() {
    return $("");
  }
  get settingsButton() {
    return $("");
  }
  get logoutButton() {
    return $("");
  }
  get notificationBell() {
    return $("");
  }
  get searchBar() {
    return $("");
  }
}

class HomeAndroidObjects extends HomeObjects {
  get welcomeText() {
    return $(
      'android=new UiSelector().resourceId("com.app.package:id/welcome_text")',
    );
  }
  get profileIcon() {
    return $(
      'android=new UiSelector().resourceId("com.app.package:id/profile_icon")',
    );
  }
  get settingsButton() {
    return $(
      'android=new UiSelector().resourceId("com.app.package:id/settings_button")',
    );
  }
  get logoutButton() {
    return $(
      'android=new UiSelector().resourceId("com.app.package:id/logout_button")',
    );
  }
  get notificationBell() {
    return $(
      'android=new UiSelector().resourceId("com.app.package:id/notification_bell")',
    );
  }
  get searchBar() {
    return $(
      'android=new UiSelector().resourceId("com.app.package:id/search_bar")',
    );
  }
}

class HomeIOSObjects extends HomeObjects {
  get welcomeText() {
    return $('-ios predicate string:name == "welcome_text"');
  }
  get profileIcon() {
    return $('-ios predicate string:name == "profile_icon"');
  }
  get settingsButton() {
    return $('-ios predicate string:name == "settings_button"');
  }
  get logoutButton() {
    return $('-ios predicate string:name == "logout_button"');
  }
  get notificationBell() {
    return $('-ios predicate string:name == "notification_bell"');
  }
  get searchBar() {
    return $('-ios predicate string:name == "search_bar"');
  }
}

export const homeLocators: HomeObjects =
  getCurrentPlatform() === "android"
    ? new HomeAndroidObjects()
    : new HomeIOSObjects();
