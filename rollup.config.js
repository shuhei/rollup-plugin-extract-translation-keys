import pkg from "./package.json";

const external = [
  ...Object.keys(pkg.dependencies),
  // Node built-in modules
  "assert",
  "fs",
  "path",
  "util"
];

export default {
  input: "./src/index.js",
  external,
  output: [
    { file: pkg.main, format: "cjs", sourcemap: true },
    { file: pkg.module, format: "esm", sourcemap: true }
  ]
};
