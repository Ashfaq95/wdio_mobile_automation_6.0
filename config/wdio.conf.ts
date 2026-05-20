import { getAndroidAppPath, getIosAppPath } from "../src/utils/app.helper";
import devices from "../devices.json";
import { specs, suites } from "./specs-and-suites";

type DeviceConfig = {
  platformName: string;
  platformVersion: string;
  deviceName?: string;
  udid?: string;
};

function buildCapability(deviceKey: string): WebdriverIO.Capabilities {
  const device = (devices as Record<string, DeviceConfig>)[deviceKey];

  if (!device) {
    throw new Error(
      `Device "${deviceKey}" not found in devices.json. ` +
        `Available devices: ${Object.keys(devices).join(", ")}`,
    );
  }

  const isIos = device.platformName.toLowerCase() === "ios";
  const appPath = isIos ? getIosAppPath() : getAndroidAppPath();

  if (isIos) {
    return {
      platformName: "iOS",
      "appium:deviceName": device.deviceName || deviceKey,
      "appium:udid": device.udid,
      "appium:platformVersion": device.platformVersion,
      "appium:app": appPath,
      "appium:automationName": "XCUITest",
      "appium:xcodeSigningId": "iPhone Developer",
      "appium:showXcodeLog": true,
    };
  }

  return {
    platformName: "Android",
    ...(device.deviceName ? { "appium:deviceName": device.deviceName } : {}),
    ...(device.udid ? { "appium:udid": device.udid } : {}),
    "appium:platformVersion": device.platformVersion,
    "appium:app": appPath,
    "appium:automationName": "UIAutomator2",
    "appium:noReset": true,
    "appium:autoGrantPermissions": true,
  };
}

// DEVICES accepts a comma-separated list; DEVICE is the single-device shorthand.
function resolveDeviceKeys(): string[] {
  const raw = process.env.DEVICES || process.env.DEVICE || "";
  const keys = raw.split(",").map((k) => k.trim()).filter(Boolean);

  if (keys.length === 0) {
    throw new Error(
      "Set DEVICE=<key> (single device) or DEVICES=<key1>,<key2> (multiple) before running. " +
        `Available keys: ${Object.keys(devices).join(", ")}`,
    );
  }

  return keys;
}

const deviceKeys = resolveDeviceKeys();
const capabilities = deviceKeys.map(buildCapability);

export const config: WebdriverIO.Config = {
  runner: "local",
  port: 4723,

  specs,
  exclude: [],
  suites,

  // One instance per device; parallel across devices when DEVICES has multiple keys.
  maxInstances: deviceKeys.length,
  capabilities,

  logLevel: "info",
  bail: 0,
  baseUrl: "",
  waitforTimeout: 30000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  services: [
    [
      "appium",
      {
        args: {
          relaxedSecurity: true,
        },
        command: "appium",
      },
    ],
  ],

  framework: "mocha",
  reporters: [
    "spec",
    [
      "allure",
      {
        outputDir: "allure-results",
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],

  mochaOpts: {
    ui: "bdd",
    timeout: 180000,
  },

  afterTest: async function (_test, _context, { passed }) {
    if (!passed) {
      const screenshot = await driver.takeScreenshot();
      await browser.saveScreenshot(
        `allure-results/screenshot-${Date.now()}.png`,
      );
      // Attach screenshot to Allure report if reporter supports it
      try {
        // @ts-ignore — allure global injected by allure-commandline reporter
        allure.addAttachment(
          "Failure Screenshot",
          Buffer.from(screenshot, "base64"),
          "image/png",
        );
      } catch {
        // Reporter not available — screenshot saved to allure-results/
      }
    }
  },
};
