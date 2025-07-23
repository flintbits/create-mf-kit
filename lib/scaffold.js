import { ask } from "./util/cliPrompts.js";
import fs from "fs-extra";
import path from "path";
import ora from "ora";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import util from "util";
import { exeCommand } from "./util/execCommand.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const TEMPLATE_BASE = path.resolve(__dirname, "../templates");

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
export async function mfeScaffold() {
  try {
    console.log(chalk.cyan("\n Welcome to create-mfe-kit"));

    const { projectName } = await ask({
      type: "text",
      name: "projectName",
      message: "Project name:",
      validate: (name) => (name ? true : "Name cannot be empty"),
    });

    const { containerFramework } = await ask({
      type: "select",
      name: "containerFramework",
      message: "Choose a framework for your app:",
      choices: [
        { title: "React(test)", value: "base" },
        { title: "React(vite)", value: "react-vite" },
        { title: "Angular", value: "angular" },
        { title: "Vue", value: "vue" },
      ],
    });

    let shared;
    if (containerFramework && containerFramework === "base") {
      shared = await ask({
        type: "select",
        name: "stateLib",
        message: "Choose a shared state management library:",
        choices: [
          { title: "None", value: "base" },
          { title: "Redux Toolkit", value: "with-redux" },
          { title: "Zustand (WIP)", value: "with-zustand" },
        ],
      });
    }

    //Creating the container based on the selected framework
    const spinner = ora("Creating project...").start();
    const projectDir = path.resolve(process.cwd(), projectName);
    const containerDir = path.resolve(process.cwd(), projectName, "container");

    try {
      switch (containerFramework) {
        //Copy the base template from ./templates
        case "base":
          const selectedTemplateDir = path.resolve(
            TEMPLATE_BASE,
            `../templates/${shared.stateLib}`
          );
          await fs.copy(selectedTemplateDir, projectDir);
          break;
        //Scaffold the react template from vite
        case "react-vite":
          await exeCommand(
            "npm",
            ["create", "vite@latest", "container", "--", "--template", "react"],
            {
              cwd: projectDir, // Important to run inside projectDir
            }
          );
          break;
        //Scaffold the vue template from vite
        case "vue":
          await exeCommand("npm", [
            "create",
            "vite@latest",
            "container",
            "--",
            "--template",
            "react",
          ]);
          break;
        //TODO Scaffold the angulat
        case "angular":
          await exeCommand("npx", [
            "-p",
            "@angular/cli",
            "ng",
            "new",
            "container",
            "--routing",
            "--style=scss",
          ]);
          break;
        default: {
          throw new Error(`Unknown framework: ${containerFramework}`);
        }
      }
      spinner.succeed("Project created successfully!");
      console.log(
        chalk.green("\n Project created at:"),
        chalk.yellow(projectDir)
      );
    } catch (err) {
      spinner.fail("Project creation failed.");
      console.error(chalk.red("Error:"), err.message);
      process.exit(1);
    }

    console.log(chalk.cyan("\n Run the following to get started\n"));
    console.log(`  cd ${projectName}`);
    console.log(chalk.white(`  cd container >> npm install >> npm start`));
    console.log(chalk.cyan("\n In a new terminal:"));
    console.log(chalk.white(`  cd app1 >> npm install >> npm start`));
  } catch (err) {
    console.error(chalk.red("Failed to scaffold project:"), err.message);
    process.exit(1);
  }
}

/*

TODO
-----------------------------------------------------------------------------------------------------------------------------
Idea (might be for focused on react at the moment)
CREATING A CONTAINER
user gets a new prompt to select the framework
user selects a framework
run the create vite or equivalent command and scaffold a react project from vite

once the container is created
created run the command again to create app1 
(same lib/framework as container for the initial app to simplify the complexity/can use template app(yet to decide)) 

mutate the scaffold with config changes along will deleting and updating the exising code in container
mutate the scaffold with config changes along will deleting and updating the exising code in app1

-----------------------------------------------------------------------------------------------------------------------------

CREATING A NEW APP
user gets a new prompt to select the framework
user selects a framework
run the create vite or equivalent command and scaffold a react project from vite

once the app is created
inject the config changes along will deleting and updating the exising code in app

POST SCAFFOLD MUTATIONS
Delete default App.jsx, main.jsx
Inject module federation plugin with correct name, remotes, exposes
Patch vite.config.js, webpack.config.js, index.html, etc.
Setup routes if needed
-----------------------------------------------------------------------------------------------------------------------------
Research on .mfe-kit.json

*/
