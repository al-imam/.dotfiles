#!/usr/bin/env zx
import "zx/globals";
import lnk from "lnk";
import { existsSync } from "fs";
import { join, normalize } from "path";
import getOption from "./utilitys/option.mjs";
import processPath from "./utilitys/processPath.mjs";
import { backupFile, backupFolder, showLogs } from "./utilitys/util.mjs";
import listDirectoryAndFile from "./utilitys/listDirectoryAndFile.mjs";

$.verbose = false;

const options = getOption(argv);

cd(normalize(join(__dirname, "src")));

const yellow = chalk.yellow;
const red = chalk.red;
const green = chalk.green;
const dim = chalk.dim;
const blue = chalk.blue;
const purple = chalk.hex("#ff92df");
const blueLight = chalk.hex("#aa77ff");

const folders = await listDirectoryAndFile();
const configurations = [];

for (const name of folders) {
  await within(async () => {
    cd(name);

    const files = await globby(".", { dot: true });
    if (!files.includes("drop.txt")) return;

    const { stdout: cat } = await $`cat ${files[files.indexOf("drop.txt")]}`;

    configurations.push({
      files: files.filter((e) => e !== "drop.txt").map((e) => normalize(e)),
      location: processPath(cat),
      name,
    });
  }).catch((fileProcessingError) => {
    if (fileProcessingError.message === "empty") {
      throw red(`drop file is empty in ${yellow(`src/${name}`)} directory! 😓`);
    }

    throw red(fileProcessingError);
  });
}

async function link(items, location, name) {
  const backupLogs = [];
  const successLogs = [];
  await within(async () => {
    if (!existsSync(location)) return;

    if (!options.b) {
      const ans = await yesOrNo(
        chalk.cyan(
          `${blueLight(name)} files are already exist create backup ? `
        )
      );
      if (ans.toLowerCase() !== "yes") return true;
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

async function yesOrNo(text, selected = "Yes", not = "No") {
  const ans = await question(
    `${text} ${dim(`(${chalk.underline(selected)}/${not})`)} `,
    { choices: ["Yes", "No"] }
  );

  if (ans === "") {
    return selected;
  }

  return ans;
}

for (const item of configurations) {
  if (!options.y) {
    const ans = await yesOrNo(
      purple(`do you want to create symlink for ${blueLight(item.name)} ?`)
    );
    if (ans.toLowerCase() !== "yes") continue;
  }
  await within(async () => {
    cd(item.name);
    const { backupLogs, successLogs } = await link(
      item.files,
      join(__dirname, item.location),
      item.name
    );
    if (backupLogs.length > 0) echo(backupLogs.join("\n"));
    if (successLogs.length > 0) echo(successLogs.join("\n"));
  });
}
