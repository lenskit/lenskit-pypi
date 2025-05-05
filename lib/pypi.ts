import { join } from "@std/path";
import { ensureDir } from "@std/fs/ensure-dir";
import { packageIndex } from "./package-index.tsx";
import { writeIndexHTML } from "./html.ts";
import { distributionIndex } from "./dist-index.tsx";

export async function renderPackageIndex(
  packages: Record<string, URL[]>,
  name: string,
  path: string,
) {
  await ensureDir(path);

  let names = Object.keys(packages);
  names.sort();
  let index = packageIndex(names, name);
  await writeIndexHTML(path, index);

  for (let [pkg, urls] of Object.entries(packages)) {
    let dir = join(path, pkg);
    await ensureDir(dir);
    let index = distributionIndex(pkg, urls);
    await writeIndexHTML(dir, index);
  }
}
