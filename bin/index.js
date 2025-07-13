#!/usr/bin/env node
import prompts from "prompts";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import ora from "ora";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_DIR = path.resolve(__dirname, "../templates/basic-mf");
const CONTAINER_WEBPACK_PATH = path.resolve(
  process.cwd(),
  "container/webpack.config.js"
);

const args = process.argv.slice(2);

if (args[0] === "add" && args[1]) {
  createNewRemoteApp(args[1]);
} else {
  mfeScaffold();
}

/**
 * Scafolds a new MFE project.
 *
 * prompts the user for the project name and the state library,
 * copies the selected template, and provides post setup instructions.
 *
 * @async
 * @function
 * @returns {Promise<void>}
 *
 */
async function mfeScaffold() {
  try {
    console.log(chalk.cyan("\n Welcome to create-mfe-kit"));

    const { projectName } = await prompts({
      type: "text",
      name: "projectName",
      message: "Project name:",
      validate: (name) => (name ? true : "Name cannot be empty"),
    });

    const { stateLib } = await prompts({
      type: "select",
      name: "stateLib",
      message: "Choose a shared state management library:",
      choices: [
        { title: "None", value: "base" },
        { title: "Redux Toolkit", value: "with-redux" },
        { title: "Zustand (WIP)", value: "with-zustand" },
      ],
    });

    const selectedTemplateDir = path.resolve(
      __dirname,
      `../templates/${stateLib}`
    );

    const targetDir = path.resolve(process.cwd(), projectName);

    const spinner = ora({
      text: "Creating project...",
      spinner: "dots",
    }).start();

    await fs.copy(selectedTemplateDir, targetDir);

    spinner.succeed("Project created successfully!");

    console.log(chalk.green("\n Project created at:"), chalk.yellow(targetDir));

    console.log(chalk.cyan("\n Run the following to get started\n"));

    console.log(`  cd ${projectName}\n`);

    console.log(chalk.white(`  cd container >> npm install >> npm start`));

    console.log(chalk.cyan("\n In a new terminal:"));

    console.log(chalk.white(`  cd app1 >> npm install >> npm start`));
  } catch (err) {
    console.error(chalk.red("Failed to scaffold project:"), err.message);
    process.exit(1);
  }
}

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
async function createNewRemoteApp(appName) {
  const { appPort } = await prompts({
    type: "number",
    name: "appPort",
    message: "Port for this app:",
    validate: (port) => (port > 0 ? true : "Enter a valid port number"),
  });

  const spinner = ora(`Creating new remote app ${appName}`).start();
  const targetDir = path.resolve(process.cwd(), appName);
  const templateAppDir = path.resolve(
    __dirname,
    "../templates/app-template/app1"
  );

  try {
    //copy the existing app1
    await fs.copy(templateAppDir, targetDir);

    //update package.json
    const pkgPath = path.join(targetDir, "package.json");
    const pkg = await fs.readJson(pkgPath);
    pkg.name = appName;

    /// Replace port in "start" script if present
    if (pkg.scripts?.start) {
      pkg.scripts.start = pkg.scripts.start.replace(
        /--port\s+\d+/,
        `--port ${appPort}`
      );
    }
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    //update webpack.config
    const webpackPath = path.join(targetDir, "webpack.config.js");
    let webpackContent = await fs.readFile(webpackPath, "utf-8");
    webpackContent = webpackContent.replace(/port:\s*\d+/, `port: ${appPort}`);

    webpackContent = webpackContent.replace(
      /name:\s*["']app1["']/,
      `name: "${appName}"`
    );

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

/*
TODO
Finish and document Zustand integration.
Add unit tests.
Replace fragile regex manipulation with an AST-based parser (e.g., recast, jscodeshift) to safely edit JS objects.
rollback if part of the add process fails
Use flags or prompts to select framework-specific templates at scaffold time.(--react, --angular, --vue)
Add --force flag to overwrite existing folders or remotes with confirmation bypass.
Improve README
Add plugin support
*/
