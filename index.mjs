#!/usr/bin/env zx
import "zx/globals";

import { globby } from "globby";
import lnk from "lnk";

$.verbose = false;

cd(`${__dirname}/src`);

const files = await globby(["."], { dot: true });

lnk(files[0], "home", { overwrite: true })
  .then(() => console.log("done"))
  .catch(async (e) => {
    // if (files[0].includes("/")) {
    //   const folderName = files[0].split("/")[0];
    //   $``;
    // }
    await $`mv ${e.dest}{,.bak.${Math.random().toString().split(".")[1]}}`;
    console.log(e.dest, e.path);
  });

echo(JSON.stringify(files, null, 4));
