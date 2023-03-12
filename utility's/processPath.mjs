function processPath(cat) {
  if (cat === "") throw new Error("empty");

  const normalizedLocation = normalize(cat);
  if (normalizedLocation.startsWith("$HOME")) {
    const arrayOfPaths = normalizedLocation.split(path.sep);
    arrayOfPaths[0] = os.homedir();
    return normalize(path.join(...arrayOfPaths));
  }

  if (
    normalizedLocation.startsWith(path.sep) &&
    !normalizedLocation.includes(":") &&
    os.platform() === "win32"
  ) {
    const arrayOfPaths = normalizedLocation
      .split(path.sep)
      .filter((e) => e !== "");
    arrayOfPaths[0] = arrayOfPaths[0].toUpperCase() + ":";
    return normalize(path.join(...arrayOfPaths));
  }

  return normalizedLocation;
}

export default processPath;
