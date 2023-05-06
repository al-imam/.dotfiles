import getTime from "./getTime.mjs";
import listDirectoryAndFile from "./listDirectoryAndFile.mjs";
import { lstatSync } from "fs";

const green = chalk.green;
const yellow = chalk.yellow;

async function recursiveBackup(path) {
  await within(async () => {
    cd(path);
    const files = await listDirectoryAndFile();
    for (const file of files) {
      if (lstatSync(file).isDirectory()) {
        recursiveBackup(file);
        continue;
      }
      await backupFileDontChangeName(file);
    }
  });
}

export async function backupFolder(item, backup = `${item}.bak_${getTime()}`) {
  await $`mv ${item} ${backup}`;
  recursiveBackup(backup);
  return [item, backup];
}

async function backupFileDontChangeName(item) {
  const { stdout: cat } = await $`cat ${item}`;
  await $`rm --force ${item}`;
  await $`echo ${cat} > ${item}`;
}

export async function backupFile(item, backup = `${item}.bak_${getTime()}`) {
  await $`cat ${item} > ${backup}`;
  await $`rm --force ${item}`;
  return [item, backup];
}

export function showLogs(x) {
  const [file, backup] = x;
  return yellow(`♻️  ${file} ${green("->")} ${backup}`);
}
