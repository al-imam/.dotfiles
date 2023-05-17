import getConfig from "./getConfig.mjs";

const { success, secondary } = getConfig();

function formatLnkLog(files, move, callback) {
  if (Array.isArray(files)) {
    const directory = secondary(move.replace(":", "").toLowerCase());
    for (const file of files) {
      const targets = success(file.trim().toLowerCase());
      callback(secondary(`📌 ${targets} -> ${directory}`));
    }
  }
}

export default formatLnkLog;
