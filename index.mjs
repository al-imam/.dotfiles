#!/usr/bin/env zx
import "zx/globals";
import symbolic from "./utilitys/symbolic.mjs";
import { join, normalize } from "path";
import getConfig from "./utilitys/getConfig.mjs";
import processPath from "./utilitys/processPath.mjs";
import listDirectoryAndFile from "./utilitys/listDirectoryAndFile.mjs";
import askBoolean from "./utilitys/askBoolean.mjs";
import messages from "./utilitys/messages.mjs";

$.verbose = false;

const { transparent, accent, failed, primary, yes } = getConfig();

cd(normalize(join(__dirname, "src")));

const folders = await listDirectoryAndFile();
const configurations = [];

for (const name of folders) {
  await within(async () => {
    cd(name);

    const files = await globby(".", { dot: true });

    if (!files.includes("drop.txt")) throw new Error("empty");

    const { stdout: cat } = await $`cat ${files[files.indexOf("drop.txt")]}`;

    configurations.push({
      files: files.filter((e) => e !== "drop.txt").map((e) => normalize(e)),
      location: processPath(cat.trim()),
      name,
    });
  }).catch((e) => {
    if (e.message === "empty") {
      throw messages.dropFileNotFound(name);
    }

    throw failed(e);
  });
}

for (const item of configurations) {
  if (!yes) {
    const ans = await askBoolean(messages.createSymbolicLink(item.name));
    if (!ans) continue;
  }

  await within(async () => {
    cd(item.name);
    const { backupLogs, successLogs } = await symbolic(
      item.files,
      item.location,
      item.name
    );
    if (backupLogs.length > 0) echo(backupLogs.join("\n"));
    if (successLogs.length > 0) echo(successLogs.join("\n"));
  });
}
