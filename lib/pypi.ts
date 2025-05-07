import { join } from "@std/path";
import { ensureDir } from "@std/fs/ensure-dir";
import { packageIndex } from "./package-index.tsx";
import { writeIndexHTML } from "./html.ts";
import { distributionIndex } from "./dist-index.tsx";
import { BinDist } from "./distribution.ts";

export async function renderPackageIndex(
  packages: Record<string, BinDist[]>,
  name: string,
  path: string,
) {
  await ensureDir(path);

  let names = Object.keys(packages);
  names.sort();
  let index = packageIndex(names, name);
  await writeIndexHTML(path, index);

  for (let [pkg, dists] of Object.entries(packages)) {
    let dir = join(path, pkg);
    await ensureDir(dir);

    await using out = await Deno.open(join(dir, "packages.ndjson"), {
      write: true,
      create: true,
      truncate: true,
    });
    let encode = new TextEncoderStream();
    let wp = encode.readable.pipeTo(out.writable);
    let writer = encode.writable.getWriter();
    for (let pkg of dists) {
      await writer.write(JSON.stringify(pkg) + "\n");
    }
    await writer.close();
    await wp;

    let urls = dists.map((d) => d.url);

    let index = distributionIndex(pkg, urls);
    await writeIndexHTML(dir, index);
  }
}
