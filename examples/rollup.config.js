import path from "path";
import jsx from "rollup-plugin-jsx";
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
    jsx({
      factory: "React.createElement"
    }),
    extractTranslationKeys({
      output: path.resolve(outputDir, "translations.json")
    })
  ]
};
