#!/usr/bin/env zx
import "zx/globals";
import lnk from "lnk";
import { existsSync } from "fs";
import { normalize } from "path";

$.verbose = false;

cd(normalize(path.join(__dirname, "src")));

const yellow = chalk.yellow;
const red = chalk.red;
const green = chalk.green;
const dim = chalk.dim;
const blue = chalk.blue;

const folders = (await $`ls -a`).stdout.split("\n").slice(2, -1);

const configurations = [];

function processPath(cat) {
  const normalizedLocation = normalize(cat);
  if (normalizedLocation.startsWith("$HOME")) {
    const arrayOfPaths = normalizedLocation.split(path.sep);
    arrayOfPaths[0] = os.homedir();
    return normalize(path.join(...arrayOfPaths));
  }

  if (
    normalizedLocation.startsWith(path.sep) &&
    !normalizedLocation.includes(":") &&
    os.platform() === "win32"
  ) {
    const arrayOfPaths = normalizedLocation
      .split(path.sep)
      .filter((e) => e !== "");
    console.log(arrayOfPaths);
  }

  return normalizedLocation;
}

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
  }).catch(() => {
    throw red("Something went wrong in processing files! 😓");
  });
}

const yellow = chalk.yellow;
const red = chalk.red;
const green = chalk.green;
const dim = chalk.dim;
const blue = chalk.blue;

const time = new Intl.DateTimeFormat("en", {
  day: "2-digit",
  second: "2-digit",
  month: "2-digit",
  year: "numeric",
  minute: "2-digit",
  hour: "2-digit",
});

function getTime() {
  return time
    .format(new Date())
    .slice(0, -3)
    .replaceAll("/", "-")
    .replaceAll(":", "-")
    .replaceAll(", ", "_");
}

function backupFolder(item) {
  const folderName = item.split("/")[0];
  return $`mv ${folderName}{,.bak_${getTime()}} -v`;
}

function backupFile(item) {
  return $`mv ${item}{,.bak_${getTime()}} -v`;
}

function showLogs(x) {
  const [file, backup] = x
    .replace("renamed", "")
    .replaceAll(" ", "")
    .replaceAll("'", "")
    .replace("\n", "")
    .split("->");
  return yellow(`♻️ ${file} ${green("->")} ${backup}`);
}

const backupLogs = [];
const successLogs = [];

async function link(items, location) {
  await within(async () => {
    if (!existsSync(location)) return;

    cd(location);

    for (const item of items) {
      if (existsSync(item)) {
        if (item.includes("/")) {
          const { stdout: log } = await backupFolder(item);
          backupLogs.push(showLogs(log));
          continue;
        }
        const { stdout: log } = await backupFile(item);
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
            successLogs.push(
              blue(
                `📌 ${green(l.replaceAll("\n", "").toLowerCase())} -> ${blue(
                  f.replace(":", "").toLowerCase()
                )}`
              )
            );
          }
        }
      },
    });
  } catch (e) {
    if (e.code === "EXDEV") {
      throw red("Cannot create symlink between tow partition! 🥲");
    }
    echo(red(JSON.stringify(e, null, 4)));
  }
}

for (const item of configurations) {
  await within(async () => {
    cd(item.name);
    const fullPath = path.join(`${dirname}`, item.location);
    await link(item.files, fullPath);
  });
}

if (backupLogs.length > 0) {
  echo(dim(`Creating backup for ${backupLogs.length} files and directory! ♻️`));
  echo(backupLogs.join("\n"));
  echo("");
}

echo(
  dim(
    `Total ${configurations.length} directory and ${configurations.reduce(
      (a, v) => v.files.length + a,
      0
    )} files 📌`
  )
);
echo(successLogs.join("\n"));
