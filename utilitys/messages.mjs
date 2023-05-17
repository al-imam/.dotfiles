import getConfig from "./getConfig.mjs";

const { failed } = getConfig();

export default {
  dropFileNotFound: (name) =>
    failed(
      `No symlink location specified for ${chalk.underline(name)} folder!`
    ),
};
