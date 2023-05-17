import getConfig from "./getConfig.mjs";
import messages from "./messages.mjs";

const { success, secondary } = getConfig();

function formatLnkLog(files, move, callback) {
  if (Array.isArray(files)) {
    const destination = secondary(move.replace(":", "").toLowerCase());
    for (const file of files) {
      const name = success(file.trim().toLowerCase());
      callback(messages.createSuccessLog(name, destination));
    }
  }
}

export default formatLnkLog;
