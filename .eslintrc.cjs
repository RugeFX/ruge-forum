module.exports = {
  root: true,
  env: { browser: true, es2020: true, "cypress/globals": true },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "airbnb",
    "airbnb-typescript",
    "plugin:storybook/recommended"
  ],
  ignorePatterns: ["dist", "public", "cypress", "stories", ".eslintrc.cjs", "*.config.ts"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname
  },
  plugins: ["react-refresh", "@typescript-eslint", "cypress"],
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "react/react-in-jsx-scope": "off",
    "react/jsx-props-no-spreading": "off",
    "react/require-default-props": "off",
    "react/prop-types": "off",
    "jsx-a11y/label-has-associated-control": [
      "error",
      {
        required: {
          some: ["nesting", "id"]
        }
      }
    ],
    "jsx-a11y/label-has-for": [
      "error",
      {
        required: {
          some: ["nesting", "id"]
        }
      }
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "src/utils/test-utils.tsx",
          "src/setup-tests.ts",
          "src/mocks/**",
          "**/*.test.ts",
          "**/*.test.tsx"
        ]
      }
    ],
    "no-param-reassign": "off"
  }
};
