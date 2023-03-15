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

const backupLogs = [];
const successLogs = [];

async function link(items, location, name) {
  await within(async () => {
    if (!existsSync(location)) return;

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
    }
    throw red(e);
  }
}

async function yesOrNo(text) {
  return await question(
    `${text} ${dim("(" + chalk.underline("Yes") + "/No) ")}`,
    { choices: ["Yes", "No"] }
  );
}

for (const item of configurations) {
  if (!options.y) {
    const ans = await yesOrNo(
      chalk.cyan(
        `do you want to create symlink for ${chalk.blueBright(item.name)} ?`
      )
    );
    if (ans.toLowerCase() !== "yes") continue;
  }
  await within(async () => {
    cd(item.name);
    await link(item.files, join(__dirname, item.location), item.name);
  });
}

function getTotal() {
  return configurations.reduce((a, v) => v.files.length + a, 0);
}

if (backupLogs.length > 0) {
  echo(dim(`Creating backup for ${backupLogs.length} files and directory! ♻️`));
  echo(backupLogs.join("\n"));
  echo("");
}

if (configurations.length > 0) {
  echo(
    dim(`Total ${configurations.length} directory and ${getTotal()} files 📌`)
  );

  echo(successLogs.join("\n"));
} else {
  echo(yellow("There is no directory or file to create symlinks 🧬"));
}
