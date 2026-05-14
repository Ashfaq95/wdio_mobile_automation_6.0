import * as fs from "fs";
import * as path from "path";
import devices from "../../config/devices.json";

function resolvePlatform(): string {
  const deviceKey = process.env.DEVICE || "";
  const device = (devices as Record<string, { platformName: string }>)[
    deviceKey
  ];
  return device ? device.platformName.toLowerCase() : "android";
}

const APPS_DIR = path.resolve(__dirname, "../../apps");

/**
 * Reads the latest APK file from apps/android/ directory.
 */
export function getAndroidAppPath(): string {
  const androidDir = path.join(APPS_DIR, "android");
  const apkFiles = fs.readdirSync(androidDir).filter((f) => f.endsWith(".apk"));

  if (apkFiles.length === 0) {
    throw new Error(
      `No .apk file found in ${androidDir}. Place your APK in apps/android/`,
    );
  }

  // Return the most recently modified APK
  const sorted = apkFiles
    .map((f) => ({
      name: f,
      time: fs.statSync(path.join(androidDir, f)).mtimeMs,
    }))
    .sort((a, b) => b.time - a.time);

  return path.join(androidDir, sorted[0].name);
}

/**
 * Reads the latest IPA file from apps/ios/ directory.
 */
export function getIosAppPath(): string {
  const iosDir = path.join(APPS_DIR, "ios");
  const ipaFiles = fs.readdirSync(iosDir).filter((f) => f.endsWith(".ipa"));

  if (ipaFiles.length === 0) {
    throw new Error(
      `No .ipa file found in ${iosDir}. Place your IPA in apps/ios/`,
    );
  }

  const sorted = ipaFiles
    .map((f) => ({ name: f, time: fs.statSync(path.join(iosDir, f)).mtimeMs }))
    .sort((a, b) => b.time - a.time);

  return path.join(iosDir, sorted[0].name);
}

export function getAppPath(): string {
  return resolvePlatform() === "ios" ? getIosAppPath() : getAndroidAppPath();
}

export function isAndroid(): boolean {
  return resolvePlatform() === "android";
}

export function isIos(): boolean {
  return resolvePlatform() === "ios";
}

export function getCurrentPlatform(): string {
  return resolvePlatform();
}
