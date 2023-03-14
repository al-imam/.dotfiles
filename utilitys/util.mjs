import getTime from "./getTime.mjs";

const green = chalk.green;
const yellow = chalk.yellow;

export function backupFolder(item) {
  const folderName = item.split(path.sep)[0];
  return $`mv ${folderName}{,.bak_${getTime()}} -v`;
}

export async function backupFile(item, backup = `${item}.bak_${getTime()}`) {
  await $`cat ${item} > ${backup}`;
  await $`rm --force ${item}`;
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
