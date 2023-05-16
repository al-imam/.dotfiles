function getConfig({
  y = false,
  yes = false,
  success = "#69ff94",
  waring = "#f1fa8c",
  failed = "#ff6e6e",
  secondary = "#d6acff",
  neutral = "#fff",
  primary = "#ff92df",
  accent = "#aa77ff",
}) {
  return {
    yes: y || yes,
    waring: chalk.hex(waring),
    failed: chalk.hex(failed),
    success: chalk.hex(success),
    transparent: chalk.dim,
    secondary: chalk.hex(secondary),
    primary: chalk.hex(primary),
    accent: chalk.hex(accent),
    neutral: chalk.hex(neutral),
  };
}

export default () => getConfig(argv);
