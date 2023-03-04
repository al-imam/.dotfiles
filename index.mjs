#!/usr/bin/env zx
import "zx/globals";

import { globby } from "globby";
import lnk from "lnk";

$.verbose = false;

cd(`${__dirname}/src`);

const files = await globby(["."], { dot: true });

lnk(files[0], "home")
  .then(() => console.log("done"))
  .catch(async (e) => {
    await $`mv ${e.dest}{,.bak}}`;
  });

echo(JSON.stringify(files, null, 4));
