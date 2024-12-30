import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
    { languageOptions: { globals: globals.node } },
    {
        rules: {
            camelcase: ["error", { properties: "always" }],
        },
    },
];
