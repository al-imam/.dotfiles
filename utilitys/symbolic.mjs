import lnk from "lnk";
import { existsSync } from "fs";
import { backupFile, backupFolder, showLogs } from "./util.mjs";
import getConfig from "./getConfig.mjs";

const { backup, blue, blueLight, green, red } = getConfig();

async function symbolic(items, location, name) {
  const backupLogs = [];
  const successLogs = [];
  await within(async () => {
    if (!existsSync(location)) return;

    if (!backup) {
      const ans = await yesOrNo(
        chalk.cyan(
          `${blueLight(name)} files are already exist create backup ? `
        )
      );
      if (ans.toLowerCase() !== "yes") return;
    }

    cd(location);
    for (const item of items) {
      if (existsSync(item)) {
        if (item.includes(path.sep)) {
          const log = await backupFolder(item.split(path.sep)[0]);
          backupLogs.push(showLogs(log));
          continue;
        }
        const log = await backupFile(item);
        backupLogs.push(showLogs(log));
      }
    }
  });

  try {
    await lnk(items, location, {
      parents: true,
      force: true,
      type: "symbolic",
      log: (_1, _2, _3, r, f) => {
        if (Array.isArray(r)) {
          for (const l of r) {
            const targets = green(l.replaceAll("\n", "").toLowerCase());
            const directory = blue(f.replace(":", "").toLowerCase());
            successLogs.push(blue(`📌 ${targets} -> ${directory}`));
          }
        }
      },
    });
  } catch (e) {
    if (e.code === "EXDEV") {
      throw red("Cannot create symlink between tow partition! 🥲");
    } else if (e.message.includes("same")) {
      echo(chalk.dim("You're trying to forcedly replace same symlink 😂"));
    } else {
      echo(chalk.red(e));
    }
  }
  return { backupLogs, successLogs };
}

export default symbolic;
