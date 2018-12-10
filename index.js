import fs from "fs";
import util from "util";
import walk from "acorn-walk";

const writeFile = util.promisify(fs.writeFile);

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
    buildEnd() {
      if (output) {
        // TODO: Find the best way to write a file with rollup.
        return writeFile(output, JSON.stringify(this.__keys));
      }
    },
    transform(source, id) {
      const ast = this.parse(source);
      walk.simple(ast, visitor, null, this.__keys);
      return null;
    }
  };
}
