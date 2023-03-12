import getTime from "./getTime.mjs";

const green = chalk.green;

export function backupFolder(item) {
  const folderName = item.split("/")[0];
  return $`mv ${folderName}{,.bak_${getTime()}} -v`;
}

export function backupFile(item) {
  return $`mv ${item}{,.bak_${getTime()}} -v`;
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
