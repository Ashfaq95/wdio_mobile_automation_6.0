export const specs = ["../test/e2e/**/*.spec.ts"];

export const suites: Record<string, string[]> = {
  login: ["../test/e2e/login/login.spec.ts"],
  home: ["../test/e2e/home/home.spec.ts"],
  smoke: [
    "../test/e2e/login/login.spec.ts",
    "../test/e2e/home/home.spec.ts",
  ],
};
