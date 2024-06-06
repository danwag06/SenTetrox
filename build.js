const rollup = require("rollup");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const advzip = require("advzip-bin");
const minifyHtml = require("html-minifier").minify;
const { default: terser } = require("@rollup/plugin-terser");

// Ensure output directory exists
if (!fs.existsSync("public")) {
  fs.mkdirSync("public");
}

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
  // Do not treat haste-arcade-sdk as an external dependency
};

const outputOptions = {
  file: "public/build.js",
  format: "iife",
  name: "app",
  globals: {
    "haste-arcade-sdk": "hasteArcadeSdk", // This can be removed since it's not external
  },
};

const advZip = () => {
  return new Promise((resolve, reject) => {
    execFile(
      advzip,
      ["-4", "-i", 1000, "-a", "./public/dist.zip", "./public/index.html"],
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

  fs.writeFileSync("public/index.html", finalHtml, { encoding: "utf-8" });

  // Copy other assets to the public directory
  fs.copyFileSync("manifest.json", "public/manifest.json");
  fs.copyFileSync("assets/eyes.gif", "public/eyes.gif");
  fs.copyFileSync("assets/font.gif", "public/font.gif");
  fs.copyFileSync("assets/gamepad.gif", "public/gamepad.gif");
  fs.copyFileSync("assets/logo.gif", "public/logo.gif");
  fs.copyFileSync("assets/texts.gif", "public/texts.gif");

  await advZip();

  const finalFileSize = fs.readFileSync("./public/dist.zip").byteLength;

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
