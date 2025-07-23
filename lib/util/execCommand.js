import spawn from "cross-spawn";

/**
 * Executes a shell command cross-platform.
 * @param {string} command - The base command (e.g. "npm" or "yarn").
 * @param {string[]} args - Array of arguments (e.g. ["install"]).
 * @param {object} options - Optional spawn options.
 * @returns {Promise<void>} Resolves on success, rejects on error/exit code.
 */
export const exeCommand = (commands, args, options = {}) => {
  return new Promise((resolve, reject) => {
    const child = spawn(commands, args, {
      stdio: "inherit",
      cwd: options.cwd || process.cwd(), // Run command in given dir
    });

    child.on("error", (err) => {
      reject(new Error(`Failed to start command: ${err.message}`));
    });

    child.on("exit", (code) => {
      if (code !== 0) {
        reject(`Command failed with the code : ${code}`);
      } else {
        resolve();
      }
    });
  });
};
