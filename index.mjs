#!/usr/bin/env zx
import "zx/globals";
import lnk from "lnk";

$.verbose = false;

cd(`${__dirname}/src`);

const folders = (await $`ls -a`).stdout.split("\n").slice(2, -1);

folders.map((n, i) => {
  within(async () => {
    cd(n);
  });
});
