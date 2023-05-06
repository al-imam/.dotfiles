import getTime from "./getTime.mjs";
import listDirectoryAndFile from "./listDirectoryAndFile.mjs";
import { join } from "path";

const green = chalk.green;
const yellow = chalk.yellow;

async function recursiveBackup(path) {
  await within(async () => {
    cd(path)
    const files = await listDirectoryAndFile();
    for (const file of files) {
      if (fs.lstatSync(file).isDirectory()) {
        recursiveBackup(file)
        continue
      };
      await backupFile(file);
    }
  })
}

export async function backupFolder(item, backup = `${item}.bak_${getTime()}`) {
  await $`mv ${item} ${backup}`;
  recursiveBackup(backup)
  return [item, backup];
}

export async function backupFile(item, backup = `${item}.bak_${getTime()}`) {
  await $`cat ${item} > ${backup}`;
  await $`rm --force ${item}`;
  return [item, backup];
}

export function showLogs(x) {
  const [file, backup] = x;
  return yellow(`♻️ ${file} ${green("->")} ${backup}`);
}
