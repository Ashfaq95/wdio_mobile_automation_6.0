# Mobile Automation — WebdriverIO + Appium + TypeScript

Native mobile test automation for **Android** and **iOS** physical devices using the **Page Object Model** pattern.

---

## Project Structure

```
mobile-automation/
├── apps/
│   ├── android/                        # Place your .apk file here
│   └── ios/                            # Place your .ipa file here
├── config/
│   ├── hooks/
│   │   └── hooks.ts                    # Single consolidated hooks file
│   ├── specsAndSuites.ts               # Spec paths and named suites
│   └── wdio.conf.ts                    # WebdriverIO configuration
├── src/
│   ├── api/
│   │   ├── login/
│   │   │   ├── login.api.ts            # Login raw HTTP calls (Axios)
│   │   │   └── loginMethods.api.ts     # Login business logic + DTOs
│   │   └── user/
│   │       ├── user.api.ts             # User raw HTTP calls (Axios)
│   │       └── userMethods.api.ts      # User business logic + DTOs
│   ├── deeplinks/
│   │   └── deeplinks.ts               # All app deeplinks in one place
│   ├── pageObjects/
│   │   ├── locators/
│   │   │   ├── login.locators.ts       # Login element selectors (platform-aware)
│   │   │   └── home.locators.ts        # Home element selectors (platform-aware)
│   │   └── actions/
│   │       ├── base.page.ts            # Base class with shared UI actions
│   │       ├── login.page.ts           # Login page actions
│   │       └── home.page.ts            # Home page actions
│   └── utils/
│       └── app.helper.ts              # App path resolver + API utilities
├── test/
│   ├── e2e/
│   │   ├── login/
│   │   │   └── login.spec.ts           # Login test cases
│   │   └── home/
│   │       └── home.spec.ts            # Home test cases
│   ├── api/                            # API-only test specs (coming soon)
│   └── integration/                    # Integration test specs (coming soon)
├── devices.json                        # Device registry
├── package.json
└── tsconfig.json
```

---

## How It Works

| Layer | Folder | Responsibility |
|---|---|---|
| Locators | `src/pageObjects/locators/` | Platform-aware element selectors |
| Page actions | `src/pageObjects/actions/` | User-facing actions — extend `BasePage` |
| Hooks | `config/hooks/hooks.ts` | Shared lifecycle + utility actions (login, scroll) |
| Deeplinks | `src/deeplinks/deeplinks.ts` | Fast direct navigation to any screen |
| API clients | `src/api/` | Backend validation alongside UI tests |
| Specs | `test/e2e/` | Test cases — every `it` block runs independently |

---

## Naming Conventions

| Target | Convention | Example |
|---|---|---|
| Files | kebab-case | `login.locators.ts`, `home.page.ts` |
| Classes | PascalCase | `LoginPage`, `HomeLocators` |
| Methods | camelCase — `<action><Element><Type>` | `tapLoginButton`, `enterUsernameInput` |
| Locators | camelCase — `<element><Type>` | `loginButton`, `usernameInput`, `errorMessage` |

---

## Prerequisites

- Node.js ≥ 18
- Appium ≥ 2.x
- Android SDK (for Android) or Xcode (for iOS)
- Physical device connected via USB with developer mode on

---

## Setup

**1. Install dependencies**

```bash
npm install
npx appium driver install uiautomator2   # Android
npx appium driver install xcuitest       # iOS
```

**2. Register your devices in `devices.json` (project root)**

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

The key (e.g. `android-device-1`) is what you pass to `DEVICE` or `DEVICES` when running tests.

**3. Fill in `.env`**

```bash
DEVICE=android-device-1

TEST_USERNAME=your_username
TEST_PASSWORD=your_password
API_BASE_URL=https://api.example.com
ACCESS_TOKEN=
TEST_USER_ID=12345
```

**4. Drop your app binary**

- Android → `apps/android/your-app.apk`
- iOS → `apps/ios/your-app.ipa`

The framework auto-picks the latest file in each folder.

---

## Running Tests

- Use `DEVICE=<key>` for a single device
- Use `DEVICES=<key1>,<key2>` to run on multiple devices in parallel
- Device keys come from `devices.json` in the project root

---

### 1. Run a specific spec file — single device

```bash
DEVICE=android-device-1 npm run test:spec -- test/e2e/login/login.spec.ts
DEVICE=ios-device-1     npm run test:spec -- test/e2e/home/home.spec.ts
```

---

### 2. Run a specific spec file — multiple devices

```bash
DEVICES=android-device-1,ios-device-1 npm run test:spec -- test/e2e/login/login.spec.ts
```

---

### 3. Run a specific suite — single device

Suites are defined in `config/specsAndSuites.ts`. Available: `login`, `home`, `smoke`.

```bash
DEVICE=android-device-1 npm run test:suite -- login
DEVICE=ios-device-1     npm run test:suite -- home
```

---

### 4. Run a specific suite — multiple devices

```bash
DEVICES=android-device-1,ios-device-1 npm run test:suite -- smoke
```

---

### 5. Run a specific `it` block from a spec file — single device

Pass the exact test title (or any unique substring) after `test:grep`, then the spec file after `--spec`.

```bash
DEVICE=android-device-1 npm run test:grep -- "should login with valid credentials" --spec test/e2e/login/login.spec.ts
DEVICE=ios-device-1     npm run test:grep -- "should land on the home screen" --spec test/e2e/home/home.spec.ts
```

You can also use a tag instead of a title to match a group of tests within a spec:

```bash
DEVICE=android-device-1 npm run test:grep -- "@smoke" --spec test/e2e/login/login.spec.ts
```

> Tags are embedded in `describe` and `it` titles using `@tagname`. Available tags:
>
> | Tag | Targets |
> |---|---|
> | `@smoke` | Critical happy-path tests |
> | `@regression` | Full regression suite |
> | `@api` | API validation tests |
> | `@login` | All tests in the login describe block |
> | `@home` | All tests in the home describe block |

---

### 6. Run a specific `it` block — multiple devices

```bash
DEVICES=android-device-1,ios-device-1 npm run test:grep -- "should login with valid credentials" --spec test/e2e/login/login.spec.ts
DEVICES=android-device-1,ios-device-1 npm run test:grep -- "@smoke" --spec test/e2e/home/home.spec.ts
```

---

### Shortcuts

```bash
npm run test:android   # All tests on android-device-1
npm run test:ios       # All tests on ios-device-1
```

---

## Hooks

`config/hooks/hooks.ts` is the single hooks file used by all specs. Register it at the top of any `describe` block:

```typescript
import { Hooks } from "../../../config/hooks/hooks";

describe("My Tests", () => {
  Hooks.register();           // wires before / beforeEach / afterEach / after
  
  beforeEach(async () => {
    await Hooks.login();      // optional — only for suites that need auth
  });
});
```

**Available utility methods on `Hooks`:**

| Method | Description |
|---|---|
| `Hooks.login(username?, password?)` | Navigate to login screen and sign in |
| `Hooks.scrollVertical("down" \| "up")` | Scroll vertically (default: down) |
| `Hooks.scrollHorizontal("left" \| "right")` | Scroll horizontally (default: left) |

Screenshots on test failure are captured automatically by the `afterTest` hook in `wdio.conf.ts` and attached to the Allure report.

---

## Deeplinks

Deeplinks let you jump directly to any screen without navigating through the UI. All links live in `src/deeplinks/deeplinks.ts` — update the scheme to match your app.

```typescript
export const Deeplinks = {
  login:         "myapp://login",
  home:          "myapp://home",
  profile:       "myapp://profile",
  settings:      "myapp://settings",
  notifications: "myapp://notifications",
  forgotPassword:"myapp://forgot-password",
} as const;
```

Use in any spec or page:

```typescript
await page.navigateViaDeeplink(Deeplinks.settings);
```

`navigateViaDeeplink` is on `BasePage` and handles both platforms — `mobile: deepLink` on Android, `driver.url()` on iOS.

---

## Adding a New Page

1. **Locators** — create `src/pageObjects/locators/<page>.locators.ts`
   - Export a platform-resolved locators instance
   - Name locators as `<element><Type>` (e.g. `submitButton`, `emailInput`)

2. **Actions** — create `src/pageObjects/actions/<page>.page.ts`
   - Extend `BasePage`
   - Name methods as `<action><Element><Type>` (e.g. `tapSubmitButton`, `enterEmailInput`)

3. **Spec** — create `test/e2e/<page>/<page>.spec.ts`
   - Call `Hooks.register()` at the top of `describe`
   - Tag each `it` with `@smoke`, `@regression`, or `@api`

4. **Suite** — add the spec path to `config/specsAndSuites.ts`

5. **Deeplinks** — add any new screen links to `src/deeplinks/deeplinks.ts`

---

## Allure Reports

```bash
npm run allure:generate   # Build the report
npm run allure:open       # Open in browser
npm run allure:report     # Build + open
```

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DEVICE` | Single device key from `devices.json` | — |
| `DEVICES` | Comma-separated keys for parallel runs | — |
| `TEST_USERNAME` | Login username for tests | `testuser` |
| `TEST_PASSWORD` | Login password for tests | `testpass` |
| `API_BASE_URL` | Backend API base URL | `https://api.example.com` |
| `ACCESS_TOKEN` | Bearer token for API calls | — |
| `TEST_USER_ID` | User ID for API validation | `12345` |
