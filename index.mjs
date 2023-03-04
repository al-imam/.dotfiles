#!/usr/bin/env zx
import "zx/globals";
import lnk from "lnk";

$.verbose = false;

cd(`${__dirname}/src`);

const folders = (await $`ls -a`).stdout.split("\n").slice(2, -1);

const arrayOfFiles = folders.reduce((accumulator, currentValue) => {
  within(async () => {
    cd(currentValue);
    const files = await globby(".", { dot: true });
    const index = files.indexOf("drop.txt");
    const { stdout: location } = await $`cat ${files.at(index)}`;
    accumulator[currentValue] = {
      files: files.filter((e) => e !== "drop.txt"),
      location,
    };
    console.log(accumulator);
  });
  return accumulator;
}, {});
