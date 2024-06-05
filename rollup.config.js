import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import url from "@rollup/plugin-url";
import { terser } from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";

export default {
  input: "src/entry.js",
  output: {
    file: "dist/build.js",
    format: "iife",
    name: "app",
  },
  plugins: [
    resolve(),
    commonjs(),
    json(),
    url(),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env"],
    }),
    terser(),
  ],
  external: ["haste-arcade-sdk"],
};
