function getConfig({ y = false, b = false }) {
  return {
    yes: y,
    backup: !b,
    yellow: chalk.yellow,
    red: chalk.red,
    green: chalk.green,
    dim: chalk.dim,
    blue: chalk.blue,
    purple: chalk.hex("#ff92df"),
    blueLight: chalk.hex("#aa77ff"),
  };
}

export default () => getConfig(argv);
