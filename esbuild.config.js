import fs from "fs-extra";
import { build } from "esbuild";
// (async () => {})();

await fs.remove("dist");

await build({
  entryPoints: ["bin/index.js"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  banner: {
    js: "#!/usr/bin/env node",
  },
  external: [
    "assert",
    "tty",
    "fs",
    "path",
    "readline",
    "os",
    "util",
    "stream",
    "child_process",
  ],
});
