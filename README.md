# Mobile Automation — WebdriverIO + Appium + TypeScript

Native mobile test automation for **Android** and **iOS** physical devices using the **Page Object Model** pattern.

---

## Project Structure

```
mobile-automation/
├── apps/
│   ├── android/               # Place your .apk file here
│   └── ios/                   # Place your .ipa file here
├── config/
│   ├── devices.json           # Device registry
│   ├── specsAndSuites.ts      # Spec paths and named suites
│   └── wdio.conf.ts           # WebdriverIO configuration
├── src/
│   ├── api/
│   │   ├── login/             # Login API methods
│   │   └── user/              # User API methods
│   ├── deeplinks/
│   │   └── deeplinks.ts       # All app deeplinks in one place
│   ├── hooks/
│   │   ├── base.hooks.ts      # Shared before/after lifecycle
│   │   ├── login.hooks.ts
│   │   └── home.hooks.ts
│   ├── pages/
│   │   └── base.page.ts       # Base class with shared actions
│   └── utils/
│       ├── app.helper.ts      # APK / IPA path resolver
│       └── api.helper.ts      # HTTP helper (axios)
├── test/
│   ├── login/
│   │   ├── login.locators.ts
│   │   ├── login.page.ts
│   │   └── login.spec.ts
│   └── home/
│       ├── home.locators.ts
│       ├── home.page.ts
│       └── home.spec.ts
└── .env
```

---

## How It Works

| Layer | Folder | Responsibility |
|---|---|---|
| Locators | `test/<page>/` | Element selectors — platform-aware internally |
| Page objects | `test/<page>/` | User actions — extend `BasePage` |
| Hooks | `src/hooks/` | Setup & teardown per page/suite |
| Deeplinks | `src/deeplinks/` | Fast direct navigation to any screen |
| API clients | `src/api/` | Backend validation alongside UI tests |
| Specs | `test/<page>/` | Test cases — every `it` block runs independently |

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

**2. Register your devices in `config/devices.json`**

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
- Device keys come from `config/devices.json`

---

### 1. Run a specific spec file — single device

```bash
DEVICE=android-device-1 npm run test:spec -- test/login/login.spec.ts
DEVICE=ios-device-1     npm run test:spec -- test/home/home.spec.ts
```

---

### 2. Run a specific spec file — multiple devices

```bash
DEVICES=android-device-1,ios-device-1 npm run test:spec -- test/login/login.spec.ts
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
DEVICE=android-device-1 npm run test:grep -- "should login with valid credentials" --spec test/login/login.spec.ts
DEVICE=ios-device-1     npm run test:grep -- "should display the home screen after login" --spec test/home/home.spec.ts
```

You can also use a tag instead of a title to match a group of tests within a spec:

```bash
DEVICE=android-device-1 npm run test:grep -- "@smoke" --spec test/login/login.spec.ts
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

### 6. Run a specific `it` block from a spec file — multiple devices

```bash
DEVICES=android-device-1,ios-device-1 npm run test:grep -- "should login with valid credentials" --spec test/login/login.spec.ts
DEVICES=android-device-1,ios-device-1 npm run test:grep -- "@smoke" --spec test/home/home.spec.ts
```

---

### Shortcuts

```bash
npm run test:android   # All tests on android-device-1
npm run test:ios       # All tests on ios-device-1
```

---

## Deeplinks

Deeplinks let you jump directly to any screen without navigating through the UI. All links live in `src/deeplinks/deeplinks.ts` — update the scheme to match your app.

```typescript
export const Deeplinks = {
  login:          "myapp://login",
  home:           "myapp://home",
  profile:        "myapp://profile",
  settings:       "myapp://settings",
  notifications:  "myapp://notifications",
  forgotPassword: "myapp://forgot-password",
} as const;
```

Use in any spec or hook:

```typescript
await page.navigateViaDeeplink(Deeplinks.settings);
```

`navigateViaDeeplink` is on `BasePage` and handles both platforms — `mobile: deepLink` on Android, `driver.url()` on iOS.

---

## Adding a New Page

1. Create `test/<page>/` with three files:
   - `<page>.locators.ts` — element selectors
   - `<page>.page.ts` — actions (extend `BasePage`)
   - `<page>.spec.ts` — tests (tag each `it` with `@smoke`, `@regression`, or `@api`)
2. Create `src/hooks/<page>.hooks.ts` (extend `BaseHooks`)
3. Add the spec to a suite in `config/specsAndSuites.ts`
4. Add any new screen deeplinks to `src/deeplinks/deeplinks.ts`

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
