import { parseHTML } from "./lib/html.ts";
import { renderPackageIndex } from "./lib/pypi.ts";

// Base URL for LensKit packages
const PKG_URL = "https://inertial.cci.drexel.edu/dist/lenskit-dev/packages/";

console.info("scanning for LensKit packages");
let res = await fetch(PKG_URL);
if (!res.ok) {
  console.error("invalid HTTP response %d: %s", res.status, res.statusText);
  Deno.exit(5);
}

let packages: URL[] = [];
let pkgRes = await fetch(PKG_URL);
if (!pkgRes.ok) {
  console.error("invalid HTTP response %d: %s", pkgRes.status, pkgRes.statusText);
  Deno.exit(5);
}
let pkgDOM = parseHTML(await pkgRes.text());
for (let dist of pkgDOM.querySelectorAll('a[href^="lenskit"]')) {
  let dURL = new URL(decodeURIComponent(dist.getAttribute("href")!), PKG_URL);
  packages.push(dURL);
}

await renderPackageIndex({ lenskit: packages }, `LensKit Dev`, "out/lenskit-dev");
