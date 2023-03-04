#!/usr/bin/env zx
import "zx/globals";

import { globby } from "globby";
import lnk from "lnk";

$.verbose = false;

cd(`${__dirname}/src`);

const files = await globby(["."], { dot: true });

lnk(files[0], "home").then(() => console.log("done"));

echo(JSON.stringify(files, null, 4));
