# Mobile Automation — WebdriverIO + Appium + TypeScript

Native mobile test automation for **Android** and **iOS** physical devices using the **Page Object Model** pattern.

---

## Project Structure

```
mobile-automation/
├── apps/
│   ├── android/                              # Place your .apk file here
│   └── ios/                                  # Place your .ipa file here
├── config/
│   ├── hooks.ts                              # Consolidated hooks + shared utilities
│   ├── specs-and-suites.ts                   # Spec paths and named suites
│   └── wdio.conf.ts                          # WebdriverIO + Appium configuration
├── src/
│   ├── api/
│   │   ├── login/
│   │   │   ├── login.api.ts                  # Raw Axios calls — login endpoints
│   │   │   └── login-methods.api.ts          # Login business logic + DTOs
│   │   └── user/
│   │       ├── user.api.ts                   # Raw Axios calls — user endpoints
│   │       └── user-methods.api.ts           # User business logic + DTOs
│   ├── deeplinks/
│   │   └── deeplinks.ts                      # App deeplink registry
│   ├── pageObjects/
│   │   ├── actions/
│   │   │   ├── base.page.ts                  # Shared low-level UI actions
│   │   │   ├── login.page.ts                 # Login screen actions
│   │   │   └── home.page.ts                  # Home screen actions
│   │   └── locators/
│   │       ├── login.locators.ts             # Login element selectors (platform-aware)
│   │       └── home.locators.ts              # Home element selectors (platform-aware)
│   └── utils/
│       └── app.helper.ts                     # App path resolver + API utilities
├── test/
│   ├── e2e/
│   │   ├── login/
│   │   │   └── login.spec.ts                 # Login test cases
│   │   └── home/
│   │       └── home.spec.ts                  # Home test cases
│   ├── api/                                  # API-only specs (coming soon)
│   └── integration/                          # Integration specs (coming soon)
├── devices.json                              # Device registry
├── tsconfig.json
├── package.json
└── .env
```

---

## Architecture

### Layer responsibilities

| Layer | Location | Responsibility |
|---|---|---|
| Locators | `src/pageObjects/locators/` | Platform-aware element selectors only |
| Page actions | `src/pageObjects/actions/` | Screen interactions — extend `BasePage` |
| Hooks | `config/hooks.ts` | Lifecycle + shared utilities (login, scroll) |
| Deeplinks | `src/deeplinks/deeplinks.ts` | Fast direct navigation to any screen |
| API — raw | `src/api/*/*.api.ts` | Axios calls with inlined URL constants |
| API — methods | `src/api/*/[name]-methods.api.ts` | Business logic, DTOs, response mapping |
| Utilities | `src/utils/app.helper.ts` | App path, platform detection, API helpers |
| Specs | `test/e2e/` | Test cases — each `it` is independent |

### How a test runs

```
Spec (it block)
  └── Page action  (e.g. loginPage.clickLoginButton())
        └── BasePage method  (this.tap / this.type / this.getText)
              └── WebdriverIO element  (driver / $())
```

API validation calls run independently alongside UI steps via the methods layer.

---

## Naming Conventions

| Target | Convention | Example |
|---|---|---|
| **Files** | kebab-case | `login-methods.api.ts`, `home.locators.ts`, `specs-and-suites.ts` |
| **Classes** | PascalCase | `LoginPage`, `HomePage`, `Hooks`, `LoginMethods` |
| **Locators** | `<element><Type>` | `loginButton`, `usernameInput`, `errorMessage`, `forgotPasswordLink` |
| **Methods** | `<action><Element><Type>` (camelCase) | `clickLoginButton`, `enterUsernameInput`, `getErrorMessage` |

---

## Locator Structure

Each locator file has three parts:

```typescript
// 1. Base class — defines the interface (selectors return empty string by default)
class LoginObjects { ... }

// 2. Platform subclasses — override with real selectors
class LoginAndroidObjects extends LoginObjects { ... }  // UIAutomator2 resourceId
class LoginIOSObjects    extends LoginObjects { ... }  // XCUITest predicate string

// 3. Resolved export — picks the right class at import time
export const loginLocators = getCurrentPlatform() === "android"
  ? new LoginAndroidObjects()
  : new LoginIOSObjects();
```

---

## Hooks

`config/hooks.ts` is the single hooks file for all specs. Register it once at the top of each `describe` block:

```typescript
import { Hooks } from "../../../config/hooks";

describe("My Tests", () => {
  Hooks.register();           // wires before / beforeEach / afterEach / after

  beforeEach(async () => {
    await Hooks.login();      // call only in suites that need an authenticated session
  });
});
```

### Lifecycle wired by `register()`

| Hook | What it does |
|---|---|
| `before` | Calls `launchApp()` — activates the app on the device |
| `beforeEach` | Re-activates the app before every test |
| `afterEach` | Delegates screenshot-on-failure to `wdio.conf.ts` |
| `after` | Logs a reminder to generate the Allure report |

Screenshots on failure are captured automatically by the `afterTest` hook in `wdio.conf.ts` and saved to `allure-results/`.

### Shared utility methods

| Method | Signature | Description |
|---|---|---|
| `Hooks.login` | `(username?, password?)` | Deeplink to login screen and sign in |
| `Hooks.scrollVertical` | `("down" \| "up")` | Vertical touch scroll (default: `"down"`) |
| `Hooks.scrollHorizontal` | `("left" \| "right")` | Horizontal touch scroll (default: `"left"`) |

---

## API Layer

Each feature has two files:

```
src/api/login/
  login.api.ts            ← raw Axios calls, URL constants defined here
  login-methods.api.ts    ← business logic, DTOs, calls login.api.ts
```

**No shared endpoints file.** Each `*.api.ts` owns its URL constants:

```typescript
// login.api.ts
const API_BASE_URL     = getApiServiceUrl();       // reads API_BASE_URL env var
const LOGIN_URL        = API_BASE_URL + "/auth/login";
const REFRESH_TOKEN_URL = API_BASE_URL + "/auth/refresh";
const VALIDATE_TOKEN_URL = API_BASE_URL + "/auth/validate";
```

**Available API methods:**

| Class | Method | Description |
|---|---|---|
| `LoginMethods` | `performLogin(username, password)` | Returns `LoginResponse` DTO |
| `LoginMethods` | `refreshToken(token)` | Returns refreshed `LoginResponse` |
| `LoginMethods` | `validateToken(token)` | Returns `boolean` |
| `UserMethodsApi` | `getUserProfile(userId)` | Returns `UserResponse` DTO |
| `UserMethodsApi` | `updateUserProfile(userId, data)` | Returns updated `UserResponse` |
| `UserMethodsApi` | `deleteUser(userId)` | Returns `boolean` |

---

## Deeplinks

All app deeplinks live in `src/deeplinks/deeplinks.ts`. Update the scheme to match your app.

```typescript
export const Deeplinks = {
  login:         "myapp://login",
  home:          "myapp://home",
  profile:       "myapp://profile",
  settings:      "myapp://settings",
  notifications: "myapp://notifications",
  forgotPassword: "myapp://forgot-password",
} as const;
```

Use in any spec or page:

```typescript
await page.navigateViaDeeplink(Deeplinks.settings);
```

`navigateViaDeeplink` on `BasePage` handles both platforms — `mobile: deepLink` on Android, `driver.url()` on iOS.

---

## Device Registry

Devices are configured in `devices.json` at the project root. Each key becomes a valid `DEVICE` value.

```json
{
  "android-device-1": {
    "platformName": "android",
    "platformVersion": "16",
    "deviceName": "",
    "udid": ""
  },
  "ios-device-1": {
    "platformName": "ios",
    "platformVersion": "18.6",
    "deviceName": "iPhoneAsfaq",
    "udid": "00008120-001630623682601E"
  }
}
```

---

## Prerequisites

- Node.js ≥ 18
- Appium ≥ 2.x (`npm install -g appium`)
- Android SDK + `adb` in PATH (for Android)
- Xcode + Xcode Command Line Tools (for iOS)
- Physical device connected via USB with developer mode on

---

## Setup

**1. Install dependencies**

```bash
npm install
npx appium driver install uiautomator2   # Android
npx appium driver install xcuitest       # iOS
```

**2. Add your device to `devices.json`** (see Device Registry above)

**3. Create `.env`**

```bash
DEVICE=android-device-1        # or ios-device-1

TEST_USERNAME=your_username
TEST_PASSWORD=your_password
API_BASE_URL=https://api.example.com
ACCESS_TOKEN=
TEST_USER_ID=12345
```

**4. Drop your app binary**

- Android → `apps/android/your-app.apk`
- iOS → `apps/ios/your-app.ipa`

The framework auto-picks the most recently modified file in each folder.

---

## Running Tests

Pass `DEVICE=<key>` for a single device or `DEVICES=<key1>,<key2>` to run in parallel across multiple devices.

### Run all tests

```bash
DEVICE=android-device-1 npm test
```

### Run a single spec file

```bash
DEVICE=android-device-1 npm run test:spec -- test/e2e/login/login.spec.ts
DEVICE=ios-device-1     npm run test:spec -- test/e2e/home/home.spec.ts
```

### Run a named suite

Suites are defined in `config/specs-and-suites.ts`. Available: `login`, `home`, `smoke`.

```bash
DEVICE=android-device-1 npm run test:suite -- login
DEVICE=ios-device-1     npm run test:suite -- smoke
```

### Run by test title or tag

```bash
DEVICE=android-device-1 npm run test:grep -- "should login with valid credentials" --spec test/e2e/login/login.spec.ts
DEVICE=android-device-1 npm run test:grep -- "@smoke" --spec test/e2e/login/login.spec.ts
```

### Run on multiple devices in parallel

```bash
DEVICES=android-device-1,ios-device-1 npm run test:suite -- smoke
```

### Shortcuts

```bash
npm run test:android   # All tests — android-device-1
npm run test:ios       # All tests — ios-device-1
```

### Available tags

| Tag | What it matches |
|---|---|
| `@smoke` | Critical happy-path tests |
| `@regression` | Full regression suite |
| `@api` | API validation tests only |
| `@login` | Entire login describe block |
| `@home` | Entire home describe block |

---

## Allure Reports

```bash
npm run allure:generate   # Build report from allure-results/
npm run allure:open       # Open report in browser
npm run allure:report     # Build + open (shortcut)
```

Screenshots from failed tests are saved automatically to `allure-results/` during a test run and attached to the report.

---

## Adding a New Page

**1. Locators** — `src/pageObjects/locators/<page>.locators.ts`
- Base class + Android and iOS subclasses
- Locator names follow `<element><Type>` (e.g. `submitButton`, `emailInput`)
- Export a single resolved instance (`getCurrentPlatform()` picks the class)

**2. Page actions** — `src/pageObjects/actions/<page>.page.ts`
- Extend `BasePage`
- Method names follow `<action><Element><Type>` (e.g. `clickSubmitButton`, `enterEmailInput`)

**3. Spec** — `test/e2e/<page>/<page>.spec.ts`
- Call `Hooks.register()` at the top of `describe`
- Call `await Hooks.login()` in `beforeEach` if the screen requires authentication
- Tag each `it` with `@smoke`, `@regression`, or `@api`

**4. Suite** — add the spec path to `config/specs-and-suites.ts`

**5. Deeplinks** — add any new screen URIs to `src/deeplinks/deeplinks.ts`

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DEVICE` | Single device key from `devices.json` | — |
| `DEVICES` | Comma-separated keys for parallel runs | — |
| `API_BASE_URL` | Backend API base URL | `https://api.example.com` |
| `ACCESS_TOKEN` | Bearer token for authenticated API calls | — |
| `TEST_USERNAME` | Login username used by `Hooks.login()` | `testuser` |
| `TEST_PASSWORD` | Login password used by `Hooks.login()` | `testpass` |
| `TEST_USER_ID` | User ID for profile API tests | `12345` |
| `USER_AGENT` | Custom User-Agent header for API calls | `MobileAutomation/1.0` |
