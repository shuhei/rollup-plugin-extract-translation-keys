import path from "path";
import extractTranslationKeys from "../index";

export default {
  input: path.resolve(__dirname, "index.js"),
  external: ["react"],
  output: {
    format: "es"
  },
  plugins: [
    extractTranslationKeys({
      output: path.resolve(__dirname, "translations.json")
    })
  ]
};
