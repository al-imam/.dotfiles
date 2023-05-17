import getConfig from "./getConfig.mjs";

const { failed, primary, accent, waring, success } = getConfig();

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
  createLogs: (file, destination) =>
    waring(`♻️  ${file} ${success("->")} ${destination}`),
};
