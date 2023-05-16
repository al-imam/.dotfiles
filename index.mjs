#!/usr/bin/env zx
import "zx/globals";
import symbolic from "./utilitys/symbolic.mjs";
import { join, normalize } from "path";
import getConfig from "./utilitys/getConfig.mjs";
import processPath from "./utilitys/processPath.mjs";
import listDirectoryAndFile from "./utilitys/listDirectoryAndFile.mjs";

$.verbose = false;

const { transparent, accent, failed, primary } = getConfig();

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
      throw failed(
        `No symlink location specified for src/${chalk.underline(name)} folder!`
      );
    }

    throw failed(fileProcessingError);
  });
}

async function yesOrNo(text, selected = "Yes", not = "No") {
  const ans = await question(
    `${text} ${transparent(`(${chalk.underline(selected)}/${not})`)} `,
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
      primary(`do you want to create symlink for ${accent(item.name)} ?`)
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
