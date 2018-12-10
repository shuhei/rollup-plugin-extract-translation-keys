import path from "path";
import extractTranslationKeys from "../index";

const outputDir = path.resolve(__dirname, "dist");

export default {
  input: path.resolve(__dirname, "index.js"),
  external: ["react"],
  output: {
    dir: outputDir,
    file: "bundle.js",
    format: "es"
  },
  plugins: [
    extractTranslationKeys({
      output: path.resolve(outputDir, "translations.json")
    })
  ]
};
