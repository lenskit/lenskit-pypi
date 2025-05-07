import { parse as parsePath } from "@std/path/posix";

// {distribution}-{version}(-{build tag})?-{python tag}-{abi tag}-{platform tag}.whl
const DIST_RE = /^(?<dist>.+)-(?<version>[^-]+)-(?<python>[^-]+)-(?<abi>[^-]+)-(?<plat>[^-]+)$/;

export interface Dist {
  url: URL;
}

export type BinDist = {
  url: URL;
  filename: string;
  distribution: string;
  version: string;
  base_version: string;
  build_tag?: string;
  python: string;
  abi: string;
  platform: string;
  core_platform: string;
};

export function parseDist(url: URL): BinDist | null {
  let path = parsePath(url.pathname);
  let m = path.name.match(DIST_RE);
  if (!m) {
    console.error("invalid distribution name: %s", path.base);
    return null;
  }

  let base_version = m.groups!.version;
  let build_tag = undefined;
  let m2 = m.groups!.version.match(/(.*)\+(.*)/);
  if (m2) {
    base_version = m2[1];
    build_tag = m2[2];
  }
  let ptm = m.groups!.plat.match(/^(?:many)?([a-z]+)\d*.*?_((?:x86_)?[a-z]*64)$/);
  let core_platform = m.groups!.plat;
  if (ptm) {
    core_platform = ptm[1] + "_" + ptm[2];
  } else if (core_platform != "any") {
    console.error("invalid platform tag %s", m.groups!.plat);
  }
  return {
    url,
    filename: path.base,
    distribution: m.groups!.dist,
    version: m.groups!.version,
    base_version,
    build_tag,
    python: m.groups!.python,
    abi: m.groups!.abi,
    platform: m.groups!.plat,
    core_platform,
  };
}
