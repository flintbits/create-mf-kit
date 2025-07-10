import prompts from "prompts";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_DIR = path.resolve(__dirname, "../templates/basic-mf");

async function main() {
  console.log(chalk.cyan("\n Welcome to create-mf-kit"));

  const { projectName } = await prompts({
    type: "text",
    name: "projectName",
    message: "Project name:",
    validate: (name) => (name ? true : "Name cannot be empty"),
  });

  const targetDir = path.resolve(process.cwd(), projectName);

  await fs.copy(TEMPLATE_DIR, targetDir);

  console.log(chalk.green("\n Project created at:"), chalk.yellow(targetDir));

  console.log(chalk.cyan("\n Run the following to get started"));

  console.log(`  cd ${projectName}`);
  console.log(`  npm install`);
  console.log(`  npm start`);
}

main();
