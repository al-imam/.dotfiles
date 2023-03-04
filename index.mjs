#!/usr/bin/env zx
import "zx/globals";
$.verbose = false;

const files = await $`ls ${__dirname}/src -a`;

echo(files);
