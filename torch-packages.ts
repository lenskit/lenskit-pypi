import { parseHTML } from "./lib/html.js";
import { renderPackageIndex } from "./lib/pypi.js";
import { BinDist, parseDist } from "./lib/distribution.js";

// Base URL for PyTorch downloads
const BASE_URL = "https://download.pytorch.org";
// Variants for Pytorch downloads
const VARIANTS = ["cu118", "cu124", "cu126", "cu128"];

const WANTED = /^(torch|triton|nvidia-)/;

let cpuPackages = await scanTorchRepo("cpu", /^torch/);
await renderPackageIndex(cpuPackages, `PyTorch CPU`, "out/torch/cpu");

for (let ver of VARIANTS) {
  let packages = await scanTorchRepo(ver);
  fillCpuVersions(packages);

  await renderPackageIndex(packages, `PyTorch ${ver}`, `out/torch/${ver}`);
}

async function scanTorchRepo(variant: string, wanted?: RegExp): Promise<Record<string, BinDist[]>> {
  wanted ??= WANTED;
  console.info("scanning for packages in %s", variant);
  let url = new URL(`/whl/${variant}/`, BASE_URL);
  let res = await fetch(url);
  if (!res.ok) {
    console.error("invalid HTTP response %d: %s", res.status, res.statusText);
    process.exit(5);
  }

  let indexDOM = parseHTML(await res.text());
  let packages: Record<string, BinDist[]> = {};
  for (let plink of indexDOM.querySelectorAll("a[href]")) {
    let name = plink.textContent.trim();
    if (!name.match(WANTED)) continue;
    packages[name] ??= [];

    console.info("fetching distributions of %s", name);
    let pkgUrl = new URL(plink.getAttribute("href")!, url);
    let pkgRes = await fetch(pkgUrl);
    if (!pkgRes.ok) {
      console.error("invalid HTTP response %d: %s", pkgRes.status, pkgRes.statusText);
      process.exit(5);
    }
    let pkgDOM = parseHTML(await pkgRes.text());
    for (let dist of pkgDOM.querySelectorAll("a[href]")) {
      let dURL = new URL(decodeURIComponent(dist.getAttribute("href")!), url);
      let pd = parseDist(dURL);
      if (pd) {
        packages[name].push(pd);
      }
    }
  }
  return packages;
}

/// Add in CPU distributions for platforms not covered by CUDA
async function fillCpuVersions(packages: Record<string, BinDist[]>) {
  for (let [name, dists] of Object.entries(packages)) {
    let cpuDists = cpuPackages[name];
    if (!cpuDists) continue;

    let plats: Record<string, Set<string>> = {};
    for (let dist of dists) {
      plats[dist.base_version] ??= new Set();
      plats[dist.base_version].add(dist.core_platform);
    }

    for (let cd of cpuDists) {
      let ps = plats[cd.base_version];
      if (ps && !ps.has(cd.core_platform)) {
        dists.push(cd);
      }
    }
  }
}
