import assert from "assert";
import fs from "fs";
import path from "path";
import util from "util";
import walk from "acorn-walk";

const stat = util.promisify(fs.stat);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

function createVisitor(functionName) {
  return {
    CallExpression(node, state) {
      if (!node.type === "CallExpression") {
        return;
      }
      const callee = node.callee;
      if (!(callee.type === "Identifier" && callee.name === functionName)) {
        return;
      }
      const arg = node.arguments[0];
      if (arg && arg.type === "Literal" && typeof arg.value === "string") {
        state[arg.value] = arg.value;
      }
    }
  };
}

export default function extractTranslationKeys(options = {}) {
  const functionName = options.functionName || "__";
  assert.equal(
    typeof functionName,
    "string",
    "functionName must to be a string"
  );
  const output = typeof options.output === "string" ? options.output : false;
  const done = options.done || (() => {});
  assert.equal(typeof done, "function", "done must be a string");

  return {
    name: "extract-translation-keys",
    buildStart() {
      // TODO: Where is the right place to store a state?
      this.__keys = Object.create(null);
    },
    async generateBundle() {
      const keys = this.__keys;
      done(keys);
      if (output) {
        // Create the directory beforehand just in case.
        try {
          await mkdir(path.dirname(output), { recursive: true });
        } catch (err) {
          if (err.code !== "EEXIST") {
            throw err;
          }
        }
        await writeFile(output, JSON.stringify(keys));
      }
    },
    transform(source, id) {
      const ast = this.parse(source);
      const visitor = createVisitor(functionName);
      walk.simple(ast, visitor, null, this.__keys);
      return null;
    }
  };
}
