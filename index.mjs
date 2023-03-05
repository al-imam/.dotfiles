#!/usr/bin/env zx
import "zx/globals";
import lnk from "lnk";

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

async function backupFolder(item, location) {
  const folderName = item.split("/")[0];
  const newFolderName = `.bak-${randomNumber()}`;
  await $`mkdir ${newFolderName}`;
  await $`mv ${location}/${folderName}{,${newFolderName}}`;
  await $`rmdir ${newFolderName}`;
  return;
}

async function backupFile(item, location) {
  await $`mv ${item}{,.bak-${randomNumber()}}`;
}

async function backupFileOrFolder(item, location) {
  if (item.includes("/")) {
    return await backupFolder(item, location);
  }
  return await backupFile(item, location);
}

async function isFileOrDirectoryExist(name) {
  let b;
  try {
    if (name.includes("/")) {
      await $`test -d ${name.split("/")[0]}`;
      b = true;
    }
    await $`test -f ${name}`;
    b = true;
  } catch {
    b = false;
  } finally {
    console.log(name, b);
  }
  return b;
}

async function link(items, location) {
  try {
    await lnk(items, location, { parents: true });
  } catch (e) {
    if (e.code === "EEXIST") {
      await within(async () => {
        if (items[0].includes("/")) {
          cd(location);
          const folderName = items[0].split("/")[0];
          const newFolderName = `${folderName}.bak-${randomNumber()}`;
          await $`mkdir ${newFolderName}`;
          await $`mv ${location}/${folderName}/ ${location}/${newFolderName}/`;
          await $`mv ${location}/${newFolderName}/${folderName}/* ${location}/${newFolderName}/`;
          await $`rmdir ${location}/${newFolderName}/${folderName}`;
          return;
        }
        await $`mv ${e.dest}{,.bak-${randomNumber()}}`;
        return;
      });
      return await link(items, location);
    }
    console.error(e);
  }
}

for (const item of configurations) {
  await within(async () => {
    cd(item.name);
    await link(item.files, `${dirname}/${item.location}`);
  });
}
