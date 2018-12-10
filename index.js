import fs from "fs";
import path from "path";
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
    async generateBundle(_outputOptions, _bundle, isWrite) {
      if (!isWrite) {
        return;
      }
      if (output) {
        // Create the directory beforehand just in case.
        try {
          await mkdir(path.dirname(output), { recursive: true });
        } catch (err) {
          if (err.code !== "EEXIST") {
            throw err;
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
