#!/usr/bin/env zx
import "zx/globals";
$.verbose = false;

const files = await $`ls src -a`;

echo(files);
