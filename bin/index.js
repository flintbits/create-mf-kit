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

async function main() {
  try {
    console.log(chalk.cyan("\n Welcome to create-mf-kit"));

    const { projectName } = await prompts({
      type: "text",
      name: "projectName",
      message: "Project name:",
      validate: (name) => (name ? true : "Name cannot be empty"),
    });

    const targetDir = path.resolve(process.cwd(), projectName);

    const spinner = ora({
      text: "Creating project...",
      spinner: "dots",
    }).start();

    await fs.copy(TEMPLATE_DIR, targetDir);

    spinner.succeed("Project created successfully!");

    console.log(chalk.green("\n Project created at:"), chalk.yellow(targetDir));

    console.log(chalk.cyan("\n Run the following to get started"));

    console.log(`  cd ${projectName}`);

    console.log(chalk.white(`  cd container`));
    console.log(chalk.white(`  npm install`));
    console.log(chalk.white(`  npm start`));

    console.log(chalk.cyan("\n In a new terminal:"));

    console.log(chalk.white(`  cd ${projectName}`));
    console.log(chalk.white(`  cd app1`));
    console.log(chalk.white(`  npm install`));
    console.log(chalk.white(`  npm start\n`));
  } catch (err) {
    console.error(chalk.red("Failed to scaffold project:"), err.message);
    process.exit(1);
  }
}

main();
