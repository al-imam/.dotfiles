#!/usr/bin/env zx
import "zx/globals";
import lnk from "lnk";

$.verbose = false;

cd(`${__dirname}/src`);

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

async function link(items, location, name) {
  try {
    await lnk(items, location, { parents: true, force: false });
  } catch (e) {
  }
}

for (const item of configurations) {
  await within(async () => {
    cd(item.name);
    await link(item.files, `${__dirname}/${item.location}`);
  });
}
