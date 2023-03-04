#!/usr/bin/env zx
import "zx/globals";
import lnk from "lnk";

$.verbose = false;

cd(`${__dirname}/src`);

const folders = (await $`ls -a`).stdout.split("\n").slice(2, -1);

folders.map((n, i) => {
  within(async () => {
    cd(n);
    const files = await globby(".", { dot: true });
    const index = files.indexOf("drop.txt");
    const { stdout: location } = await $`cat ${files.at(index)}`;
    console.log(files, location);
  });
});
