import getConfig from "./getConfig.mjs";

const { failed, primary, accent, waring, success, secondary } = getConfig();

export default {
  dropFileNotFound: (name) =>
    failed(
      `No symlink location specified for ${chalk.underline(name)} folder!`
    ),

  createSymbolicLink: (name) =>
    primary(`do you want to create symlink for ${accent(name)} ?`),

  cannotCreateSymbolicLink: failed(
    "Cannot create symlink between tow partition! 🥲"
  ),

  createBackupLog: (file, destination) =>
    waring(`♻️  ${file} ${success("->")} ${destination}`),

  createSuccessLog: (file, destination) =>
    secondary(`📌 ${file} -> ${destination}`),
};
