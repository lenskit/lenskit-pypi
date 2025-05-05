import { parseHTML } from "./lib/html.ts";
import { renderPackageIndex } from "./lib/pypi.ts";

// Base URL for PyTorch downloads
const BASE_URL = "https://download.pytorch.org";
// Variants for Pytorch downloads
const VARIANTS = ["cpu", "cu118", "cu124", "cu126", "cu128"];

const WANTED = /^(torch|triton|nvidia-)/;

for (let ver of VARIANTS) {
  console.info("scanning for packages in %s", ver);
  let url = new URL(`/whl/${ver}/`, BASE_URL);
  let res = await fetch(url);
  if (!res.ok) {
    console.error("invalid HTTP response %d: %s", res.status, res.statusText);
    Deno.exit(5);
  }

  let indexDOM = parseHTML(await res.text());
  let packages: Record<string, URL[]> = {};
  for (let plink of indexDOM.querySelectorAll("a[href]")) {
    let name = plink.textContent.trim();
    if (!name.match(WANTED)) continue;
    packages[name] ??= [];

    console.info("fetching distributions of %s", name);
    let pkgUrl = new URL(plink.getAttribute("href")!, url);
    let pkgRes = await fetch(pkgUrl);
    if (!pkgRes.ok) {
      console.error("invalid HTTP response %d: %s", pkgRes.status, pkgRes.statusText);
      Deno.exit(5);
    }
    let pkgDOM = parseHTML(await pkgRes.text());
    for (let dist of pkgDOM.querySelectorAll("a[href]")) {
      let dURL = new URL(dist.getAttribute("href")!, url);
      packages[name].push(dURL);
    }
  }

  await renderPackageIndex(packages, `PyTorch ${ver}`, `out/torch/${ver}`);
}
