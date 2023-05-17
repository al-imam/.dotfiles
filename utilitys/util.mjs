import getTime from "./getTime.mjs";
import listDirectoryAndFile from "./listDirectoryAndFile.mjs";
import { lstatSync } from "fs";
import getConfig from "./getConfig.mjs";

const { success, waring } = getConfig();

async function recursiveBackup(path) {
  return await within(async () => {
    cd(path);
    const files = await listDirectoryAndFile();
    for (const file of files) {
      if (lstatSync(file).isDirectory()) {
        recursiveBackup(file);
        continue;
      }
      await backupFileNotChangeName(file);
    }
  });
}

export async function backupFolder(item, backup = `${item}.bak_${getTime()}`) {
  await $`mv ${item} ${backup}`;
  await recursiveBackup(backup);
  return [item, backup];
}

async function backupFileNotChangeName(item) {
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
  return waring(`♻️  ${x[0]} ${success("->")} ${x[1]}`);
}
