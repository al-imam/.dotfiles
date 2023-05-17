import getConfig from "./getConfig.mjs";

const { failed, primary, accent } = getConfig();

export default {
  dropFileNotFound: (name) =>
    failed(
      `No symlink location specified for ${chalk.underline(name)} folder!`
    ),
  createSymbolicLink: (name) =>
    primary(`do you want to create symlink for ${accent(name)} ?`),
};
