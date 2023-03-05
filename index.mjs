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
  const newFolderName = `.bak-${randomNumber()}`;
  return $`mv ${location}/${folderName}{,${newFolderName}}`;
}

function backupFile(item, location) {
  return $`mv ${location}/${item}{,.bak-${randomNumber()}}`;
}

async function link(items, location) {
  for (const item of items) {
    try {
      await lnk(item, location, { parents: true });
    } catch (e) {
      console.log(e);
      if (e.code === "EEXIST") {
        if (item.includes("/")) {
          await backupFolder(item, location);
          await lnk(item, location, { parents: true });
          continue;
        }
        await backupFile(item, location);
        await lnk(item, location, { parents: true });
      }
    }
  }
}

for (const item of configurations) {
  await within(async () => {
    cd(item.name);
    await link(item.files, `${dirname}/${item.location}`);
  });
}
