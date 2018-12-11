const assert = require("assert");
const path = require("path");
const fs = require("fs");
const util = require("util");

const sinon = require("sinon");
const rimraf = require("rimraf");
const rollup = require("rollup");
const jsx = require("rollup-plugin-jsx");
const extractTranslationKeys = require("..");

const outputDir = path.join(__dirname, "dist");

const readFile = util.promisify(fs.readFile);

async function readJSON(filepath) {
  const content = await readFile(filepath, { encoding: "utf8" });
  return JSON.parse(content);
}

const outputOptions = {
  dir: outputDir,
  file: "bundle.js",
  format: "es"
};

const expectedKeys = {
  "foo.bar": "foo.bar",
  "some.example": "some.example",
  "some.interpolation": "some.interpolation",
  "some.word": "some.word"
};

async function build(sampleName, options) {
  const sampleDir = path.join(__dirname, "samples", sampleName);
  const inputOptions = {
    input: path.join(sampleDir, "index.js"),
    external: ["react"],
    plugins: [
      jsx({
        factory: "React.createElement"
      }),
      extractTranslationKeys(options)
    ]
  };
  const bundle = await rollup.rollup(inputOptions);
  return bundle.generate(outputOptions);
}

describe("rollup-plugin-extract-translation-keys", () => {
  beforeEach(done => {
    rimraf(outputDir, done);
  });

  it("extracts translation keys", async () => {
    const done = sinon.stub();
    await build("basic", { done });

    assert.deepEqual(done.args, [[expectedKeys]]);
  });

  it("writes translation keys into the specified output path", async () => {
    const output = path.join(outputDir, "translation-keys-for-test.json");
    await build("basic", { output });

    assert.deepEqual(await readJSON(output), expectedKeys);
  });

  it("extracts translation keys from custom function name", async () => {
    const done = sinon.stub();
    await build("custom-function-name", { done, functionName: "__TR__" });

    const keys = {
      "foo.bar": "foo.bar",
      "bar.baz": "bar.baz"
    };
    assert.deepEqual(done.args, [[keys]]);
  });
});
