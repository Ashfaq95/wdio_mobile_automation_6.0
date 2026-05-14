import type { Deeplink } from "../deeplinks/deeplinks";

/**
 * BasePage — common reusable actions for all page objects.
 * Every action page extends this class.
 */
export class BasePage {
  async tap(element: ChainablePromiseElement): Promise<void> {
    await element.waitForDisplayed({ timeout: 15000 });
    await element.click();
  }

  async type(element: ChainablePromiseElement, text: string): Promise<void> {
    await element.waitForDisplayed({ timeout: 15000 });
    await element.clearValue();
    await element.setValue(text);
  }

  async getText(element: ChainablePromiseElement): Promise<string> {
    await element.waitForDisplayed({ timeout: 15000 });
    return element.getText();
  }

  async isDisplayed(
    element: ChainablePromiseElement,
    timeout = 10000,
  ): Promise<boolean> {
    try {
      await element.waitForDisplayed({ timeout });
      return true;
    } catch {
      return false;
    }
  }

  async waitForElement(
    element: ChainablePromiseElement,
    timeout = 15000,
  ): Promise<void> {
    await element.waitForDisplayed({ timeout });
  }

  async waitForElementToDisappear(
    element: ChainablePromiseElement,
    timeout = 15000,
  ): Promise<void> {
    await element.waitForDisplayed({ timeout, reverse: true });
  }

  async hideKeyboard(): Promise<void> {
    try {
      await driver.hideKeyboard();
    } catch {
      // Keyboard may not be visible — ignore
    }
  }

  async scrollDown(): Promise<void> {
    const { width, height } = await driver.getWindowSize();
    await driver.touchPerform([
      { action: "press", options: { x: width / 2, y: height * 0.8 } },
      { action: "wait", options: { ms: 500 } },
      { action: "moveTo", options: { x: width / 2, y: height * 0.2 } },
      { action: "release", options: {} },
    ]);
  }

  async scrollUp(): Promise<void> {
    const { width, height } = await driver.getWindowSize();
    await driver.touchPerform([
      { action: "press", options: { x: width / 2, y: height * 0.2 } },
      { action: "wait", options: { ms: 500 } },
      { action: "moveTo", options: { x: width / 2, y: height * 0.8 } },
      { action: "release", options: {} },
    ]);
  }

  async launchApp(): Promise<void> {
    await driver.activateApp(
      driver.isAndroid
        ? (driver.capabilities as Record<string, string>)["appPackage"]
        : (driver.capabilities as Record<string, string>)["bundleId"],
    );
  }

  async closeApp(): Promise<void> {
    await driver.terminateApp(
      driver.isAndroid
        ? (driver.capabilities as Record<string, string>)["appPackage"]
        : (driver.capabilities as Record<string, string>)["bundleId"],
    );
  }

  async pause(ms: number): Promise<void> {
    await driver.pause(ms);
  }

  async navigateViaDeeplink(deeplink: Deeplink): Promise<void> {
    if (driver.isAndroid) {
      const appPackage = (driver.capabilities as Record<string, string>)[
        "appPackage"
      ];
      await driver.execute("mobile: deepLink", { url: deeplink, package: appPackage });
    } else {
      await driver.url(deeplink);
    }
  }
}
