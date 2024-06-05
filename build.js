const rollup = require("rollup");
const fs = require("fs");
const tempfile = require("tempfile");
const { execFile } = require("child_process");
const advzip = require("advzip-bin");
const minifyHtml = require("html-minifier").minify;
const { default: terser } = require("@rollup/plugin-terser");

const inputOptions = {
  input: "src/entry.js",
  plugins: [
    require("@rollup/plugin-node-resolve").nodeResolve(),
    require("@rollup/plugin-commonjs")(),
    require("@rollup/plugin-json")(),
    require("@rollup/plugin-url")(),
    require("@rollup/plugin-babel").babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env"],
    }),
    terser(),
  ],
  external: ["haste-arcade-sdk"],
};

const outputOptions = {
  file: "dist/build.js",
  format: "iife",
  name: "app",
  globals: {
    "haste-arcade-sdk": "hasteArcadeSdk",
  },
};

const advZip = () => {
  return new Promise((resolve, reject) => {
    execFile(
      advzip,
      ["-4", "-i", 1000, "-a", "./dist/dist.zip", "./dist/index.html"],
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      }
    );
  });
};

async function build() {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.write(outputOptions);

  const minifiedHtml = minifyHtml(
    fs.readFileSync("index.html", { encoding: "utf-8" }),
    {
      collapseWhitespace: true,
      minifyCSS: true,
      removeAttributeQuotes: true,
    }
  );

  const newScriptTag = `<script src="build.js"></script>`;
  const finalHtml = minifiedHtml.replace(
    /<script[^>]+><\/script>/,
    (match) => newScriptTag
  );

  fs.writeFileSync("dist/index.html", finalHtml, { encoding: "utf-8" });

  await advZip();

  const finalFileSize = fs.readFileSync("./dist/dist.zip").byteLength;

  const limit = 13 * 1024;
  const perc = ((finalFileSize * 100) / limit).toFixed(1);
  console.log(`Final file size: ${finalFileSize} (${perc}% of 13kb)`);

  if (finalFileSize > limit) {
    console.error(`That's ${finalFileSize - limit} too many bytes!`);
  } else {
    console.log(`${limit - finalFileSize} bytes left!`);
  }
}

build();
