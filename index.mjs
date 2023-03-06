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

async function link(items, location) {
  await within(async () => {
    if (!existsSync(location)) return;

    cd(location);

    for (const item of items) {
      if (existsSync(item)) {
        if (item.includes("/")) {
          const { stdout: log } = await backupFolder(item);
          echo(
            chalk.yellow(
              log
                .replaceAll("'", "")
                .replace("\n", "")
                .replace("renamed", "backup")
            )
          );
          continue;
        }
        await backupFile(item);
      }
    }
  });

  try {
    const array = await lnk(items, location, {
      parents: true,
      log: (_1, _2, _3, replace, file) => {
        if (Array.isArray(replace)) {
          replace.forEach((e, i) => {
            echo(
              chalk.green(
                `${e.replaceAll("\n", "")} -> ${file.replace(":", "")}`
              )
            );
          });
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
