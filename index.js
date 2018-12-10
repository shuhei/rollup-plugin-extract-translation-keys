import fs from "fs";
import util from "util";
import walk from "acorn-walk";

const stat = util.promisify(fs.stat);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

const visitor = {
  CallExpression(node, state) {
    if (!node.type === "CallExpression") {
      return;
    }
    const callee = node.callee;
    if (!(callee.type === "Identifier" && callee.name === "__")) {
      return;
    }
    const arg = node.arguments[0];
    if (arg && arg.type === "Literal" && typeof arg.value === "string") {
      state[arg.value] = arg.value;
    }
  }
};

export default function extractTranslationKeys(options) {
  const output = options.output || false;
  return {
    name: "extract-translation-keys",
    buildStart() {
      // TODO: Where is the right place to store a state?
      this.__keys = Object.create(null);
    },
    async generateBundle(outputOptions, bundle, isWrite) {
      if (output) {
        if (outputOptions.dir) {
          // Create the output dir beforehand just in case the output is written
          // there.
          try {
            await mkdir(outputOptions.dir, { recursive: true });
          } catch (err) {
            if (err.code !== "EEXIST") {
              throw err;
            }
          }
        }
        await writeFile(output, JSON.stringify(this.__keys));
      }
    },
    transform(source, id) {
      const ast = this.parse(source);
      walk.simple(ast, visitor, null, this.__keys);
      return null;
    }
  };
}
