const fs = require("fs-extra");
const build = require("esbuild").build;

(async () => {
  await fs.remove("dist");

  await build({
    entryPoints: ["bin/index.js"],
    outfile: "dist/index.js",
    bundle: true,
    platform: "node",
    format: "cjs",
    target: "node18",
    banner: {
      js: "#!/usr/bin/env node",
    },
  });
})();
