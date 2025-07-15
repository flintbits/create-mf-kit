import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

/**
 * Prompts the user for input.Returns the user response as
 * a key value pair where key is the name and user response is value.
 *
 * @async
 * @function
 * @param {string} type - Type of the input to enter.
 * @param {string} name - The name/key used to identify the answer.
 * @param {string} message - The question to be displayed to the user.
 * @param {fuction} validate - A function validates the user input.
 * @param {array} choices - A array of choices
 * @return {Object}
 *
 */
export async function ask({ type = "text", name, message, validate, choices }) {
  //The readlinePromises.createInterface() method creates a new readlinePromises.Interface instance.
  const rl = readline.createInterface({ input, output });

  //value created and be assiged with user input
  let value;

  while (true) {
    if (type === "select") {
      console.log(`${message}`);
      choices.forEach((c, i) => {
        console.log(` ${i + 1} :: ${c.title}`);
      });

      const answer = await rl.question("Select a option(number)");
      const idx = Number(answer) - 1;
      value = choices?.[idx]?.value;
      if (!value) {
        console.log("Invalid selection please try again");
        continue;
      }
    } else {
      const answer = await rl.question(`${message}`);

      if (type === "number") {
        const num = Number(answer);
        if (isNaN(num)) {
          console.log("Enter a valid number");
          continue;
        }
        value = num;
      } else {
        value = answer;
      }

      if (validate) {
        const valid = validate(value);
        if (valid !== true) {
          console.log(`${valid}\n`);
          continue;
        }
      }
    }
    break;
  }
  rl.close();

  return { [name]: value };
}
