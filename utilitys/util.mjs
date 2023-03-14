import getTime from "./getTime.mjs";
import listDirectoryAndFile from "./listDirectoryAndFile.mjs";
import { join } from "path";

const green = chalk.green;
const yellow = chalk.yellow;

export async function backupFolder(item, backup = `${item}.bak_${getTime()}`) {
  await $`mkdir ${backup}`;

  const files = await listDirectoryAndFile(item);

  for (const file of files) {
    if (fs.lstatSync(join(item, file)).isDirectory()) continue;
    await backupFile(join(item, file), join(backup, file));
  }
  return [item, backup];
}

export async function backupFile(item, backup = `${item}.bak_${getTime()}`) {
  await $`cat ${item} > ${backup}`;
  await $`rm --force ${item}`;
  return [item, backup];
}

export function showLogs(x) {
  const [file, backup] = x
    .replace("renamed", "")
    .replaceAll(" ", "")
    .replaceAll("'", "")
    .replace("\n", "")
    .split("->");
  return yellow(`♻️ ${file} ${green("->")} ${backup}`);
}
