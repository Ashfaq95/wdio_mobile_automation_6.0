export const Deeplinks = {
  login: "myapp://login",
  home: "myapp://home",
  profile: "myapp://profile",
  settings: "myapp://settings",
  notifications: "myapp://notifications",
  forgotPassword: "myapp://forgot-password",
} as const;

export type Deeplink = (typeof Deeplinks)[keyof typeof Deeplinks];
