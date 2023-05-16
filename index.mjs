#!/usr/bin/env zx
import "zx/globals";
import symbolic from "./utilitys/symbolic.mjs";
import { existsSync } from "fs";
import { join, normalize } from "path";
import getConfig from "./utilitys/getConfig.mjs";
import processPath from "./utilitys/processPath.mjs";
import { backupFile, backupFolder, showLogs } from "./utilitys/util.mjs";
import listDirectoryAndFile from "./utilitys/listDirectoryAndFile.mjs";

$.verbose = false;

const { backup, blue, blueLight, dim, green, purple, red, yellow, yes } =
  getConfig();

cd(normalize(join(__dirname, "src")));

const folders = await listDirectoryAndFile();
const configurations = [];

for (const name of folders) {
  await within(async () => {
    cd(name);

    const files = await globby(".", { dot: true });
    if (!files.includes("drop.txt")) throw new Error("empty");

    const { stdout: cat } = await $`cat ${files[files.indexOf("drop.txt")]}`;

    configurations.push({
      files: files.filter((e) => e !== "drop.txt").map((e) => normalize(e)),
      location: processPath(cat.trim()),
      name,
    });
  }).catch((fileProcessingError) => {
    if (fileProcessingError.message === "empty") {
      throw red(
        `No symlink location specified for src/${chalk.underline(name)} folder!`
      );
    }
    throw red(fileProcessingError);
  });
}

async function yesOrNo(text, selected = "Yes", not = "No") {
  const ans = await question(
    `${text} ${dim(`(${chalk.underline(selected)}/${not})`)} `,
    { choices: ["Yes", "No"] }
  );

  if (ans === "" || ["yes", "y", "Y"].includes(ans)) {
    return selected;
  }

  return ans;
}

for (const item of configurations) {
  if (!yes) {
    const ans = await yesOrNo(
      purple(`do you want to create symlink for ${blueLight(item.name)} ?`)
    );
    if (ans.toLowerCase() !== "yes") continue;
  }
  await within(async () => {
    cd(item.name);
    const { backupLogs, successLogs } = await symbolic(
      item.files,
      item.location,
      item.name
    );
    if (backupLogs.length > 0) echo(backupLogs.join("\n"));
    if (successLogs.length > 0) echo(successLogs.join("\n"));
  });
}
