import { join } from "node:path";
import * as fs from 'node:fs/promises';

import { packageIndex } from "./package-index.js";
import { writeIndexHTML } from "./html.js";
import { distributionIndex } from "./dist-index.js";
import { Dist } from "./distribution.js";

export async function renderPackageIndex(
  packages: Record<string, Dist[]>,
  name: string,
  path: string,
) {
  await fs.mkdir(path, { recursive: true })

  let names = Object.keys(packages);
  names.sort();
  let index = packageIndex(names, name);
  await writeIndexHTML(path, index);

  for (let [pkg, dists] of Object.entries(packages)) {
    let dir = join(path, pkg);
    await fs.mkdir(dir, { recursive: true });

    await using out = await fs.open(join(dir, 'packages.ndjson'), 'w');
    for (let pkg of dists) {
      await out.write(JSON.stringify(pkg) + "\n");
    }

    let urls = dists.map((d) => d.url);

    let index = distributionIndex(pkg, urls);
    await writeIndexHTML(dir, index);
  }
}
