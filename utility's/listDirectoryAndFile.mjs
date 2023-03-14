async function listDirectoryAndFile(path = "") {
  const { stdout: output } = await $`ls -a`;
  return output.split("\n").slice(2, -1);
}

export default listDirectoryAndFile;
