#!/usr/bin/env zx
import "zx/globals";
import { globby } from "globby";
$.verbose = false;

cd(`${__dirname}/src`);

const files = await globby(["."], { dot: true });

echo(JSON.stringify(files, null, 4));
