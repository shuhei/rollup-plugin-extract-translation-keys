const assert = require("assert");
const path = require("path");
const fs = require("fs");
const util = require("util");

const sinon = require("sinon");
const rimraf = require("rimraf");
const rollup = require("rollup");
const jsx = require("rollup-plugin-jsx");
const extractTranslationKeys = require("..");

const sampleDir = path.join(__dirname, "samples");
const outputDir = path.join(sampleDir, "dist");

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

async function build(options) {
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
    await build({ done });

    assert.deepEqual(done.args, [[expectedKeys]]);
  });

  it("writes translation keys into the specified output path", async () => {
    const output = path.join(outputDir, "translation-keys-for-test.json");
    await build({ output });

    assert.deepEqual(await readJSON(output), expectedKeys);
  });
});
