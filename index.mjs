#!/usr/bin/env zx
import "zx/globals";
import lnk from "lnk";
import { existsSync } from "fs";

$.verbose = false;

const dirname = __dirname.replaceAll("\\", "/");

cd(`${dirname}/src`);

const folders = (await $`ls -a`).stdout.split("\n").slice(2, -1);

const configurations = [];

for (const name of folders) {
  await within(async () => {
    cd(name);
    const files = await globby(".", { dot: true });
    const index = files.indexOf("drop.txt");
    const { stdout: location } = await $`cat ${files.at(index)}`;
    configurations.push({
      files: files.filter((e) => e !== "drop.txt"),
      location,
      name,
    });
  });
}

const yellow = chalk.yellow;
const red = chalk.red;
const cyan = chalk.cyan;
const green = chalk.green;
const white = chalk.whiteBright;
const blue = chalk.blue;

function randomNumber() {
  return Math.random().toString().split(".")[1];
}

function backupFolder(item) {
  const folderName = item.split("/")[0];
  return $`mv ${folderName}{,.bak-${randomNumber()}} -v`;
}

function backupFile(item) {
  return $`mv ${item}{,.bak-${randomNumber()}} -v`;
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
    echo(chalk.red(JSON.stringify(e, null, 4)));
  }
}

for (const item of configurations) {
  await within(async () => {
    cd(item.name);
    await link(item.files, `${dirname}/${item.location}`);
  });
}

echo(backupLogs.join("\n"));
echo(
  chalk.dim(
    `\nTotal ${configurations.length} directory and ${configurations.reduce(
      (a, v) => v.files.length + a,
      0
    )} files 🥲`
  )
);
echo(successLogs.join("\n"));
