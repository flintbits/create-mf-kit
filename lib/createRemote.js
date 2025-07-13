const prompts = require("prompts");
const fs = require("fs-extra");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

const TEMPLATE_BASE = path.resolve(__dirname, "../templates");

const CONTAINER_WEBPACK_PATH = path.resolve(
  process.cwd(),
  "container/webpack.config.js"
);

/**
 * creates a new mfe app based on the template
 *
 * Prompts the port number, copies the template file, updates
 * `package.json`,`webpack.config.js`, and modifies the container config
 *
 * @async
 * @function
 * @param {string} appName - The name of the remote app to create.
 * @returns{Promise<void>}
 *
 * @example
 * createNewRemoteApp("app2")
 */
export async function createNewRemoteApp(appName) {
  const { appPort } = await prompts({
    type: "number",
    name: "appPort",
    message: "Port for this app:",
    validate: (port) => (port > 0 ? true : "Enter a valid port number"),
  });

  const spinner = ora(`Creating new remote app ${appName}`).start();
  const targetDir = path.resolve(process.cwd(), appName);
  const templateAppDir = path.resolve(
    TEMPLATE_BASE,
    "../templates/app-template/app1"
  );

  try {
    await fs.copy(templateAppDir, targetDir);

    const pkgPath = path.join(targetDir, "package.json");
    const pkg = await fs.readJson(pkgPath);
    pkg.name = appName;
    if (pkg.scripts?.start) {
      pkg.scripts.start = pkg.scripts.start.replace(
        /--port\s+\d+/,
        `--port ${appPort}`
      );
    }
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    const webpackPath = path.join(targetDir, "webpack.config.js");
    let webpackContent = await fs.readFile(webpackPath, "utf-8");
    webpackContent = webpackContent
      .replace(/port:\s*\d+/, `port: ${appPort}`)
      .replace(/name:\s*["']app1["']/, `name: "${appName}"`);
    await fs.writeFile(webpackPath, webpackContent);

    await updateContainerRemotes(appName, appPort);

    spinner.succeed(
      `Created new remote: ${chalk.magenta(appName)} on port ${chalk.yellow(
        appPort
      )}`
    );
    console.log(chalk.cyan(`\n To run your app:`));
    console.log(`  cd ${appName} >> npm install >> npm start`);
  } catch (err) {
    spinner.fail("Failed to create remote app");
    console.error(err.message);
  }
}

/**
 * updates the webpacks configuration to include the new remote
 *
 * @async
 * @function
 * @param {string} appName - The name of the remote app
 * @param {number} appPort - The port number on which the remote app runs
 * @returns {Promise<void>}
 *
 * @example
 * updateContainerRemotes("app2",3002)
 */
async function updateContainerRemotes(appName, appPort) {
  try {
    let content = await fs.readFile(CONTAINER_WEBPACK_PATH, "utf-8");

    const remotesRegex = /remotes\s*:\s*{([\s\S]*?)}/;
    const newRemote = `  ${appName}: "${appName}@http://localhost:${appPort}/remoteEntry.js",`;

    if (!remotesRegex.test(content)) {
      console.log(
        chalk.red("Could not find remotes block in container webpack config.")
      );
      return;
    }

    content = content.replace(remotesRegex, (match, inside) => {
      if (inside.includes(`${appName}:`)) {
        console.log(
          chalk.yellow(`Remote "${appName}" already exists in container.`)
        );
        return match;
      }
      const updated = `${inside.trimEnd()}\n${newRemote}\n`;
      return `remotes: {\n${updated}}`;
    });

    await fs.writeFile(CONTAINER_WEBPACK_PATH, content);
    console.log(
      chalk.green(`Updated container to include remote "${appName}"`)
    );
  } catch (err) {
    console.log(
      chalk.red("Failed to update container webpack config:"),
      err.message
    );
  }
}
