import { normalize } from "path";

async function listDirectoryAndFile(path = "") {
  const { stdout: output } = await $`ls -a ${path}`;
  return output
    .split("\n")
    .slice(2, -1)
    .map((p) => normalize(p));
}

export default listDirectoryAndFile;
