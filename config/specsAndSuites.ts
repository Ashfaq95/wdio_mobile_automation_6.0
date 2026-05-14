export const specs = ["../test/**/*.spec.ts"];

export const suites: Record<string, string[]> = {
  login: ["../test/login/login.spec.ts"],
  home: ["../test/home/home.spec.ts"],
  smoke: [
    "../test/login/login.spec.ts",
    "../test/home/home.spec.ts",
  ],
};
