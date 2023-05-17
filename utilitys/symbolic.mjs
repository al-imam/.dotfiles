import lnk from "lnk";
import { existsSync } from "fs";
import { backupFile, backupFolder, showLogs } from "./util.mjs";
import getConfig from "./getConfig.mjs";

const { success, secondary, failed, backup } = getConfig();

async function symbolic(items, location, name) {
  const backupLogs = [];
  const successLogs = [];

  await within(async () => {
    if (!existsSync(location) || !backup) return;

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
            const targets = success(l.replaceAll("\n", "").toLowerCase());
            const directory = secondary(f.replace(":", "").toLowerCase());
            successLogs.push(secondary(`📌 ${targets} -> ${directory}`));
          }
        }
      },
    });
  } catch (e) {
    if (e.code === "EXDEV") {
      throw failed("Cannot create symlink between tow partition! 🥲");
    }

    throw failed(e);
  }

  return { backupLogs, successLogs };
}

export default symbolic;
