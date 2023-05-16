import getConfig from "./getConfig.mjs";

const { transparent } = getConfig();

async function askBoolean(text, selected = "yes", not = "no") {
  const ans = await question(
    `${text} ${transparent(`(${chalk.underline(selected)}/${not})`)} `,
    { choices: ["yes", "no"] }
  );

  if (ans === "" || ["yes", "Yes", "y", "Y"].includes(ans)) {
    return true;
  }

  return false;
}

export default askBoolean;
