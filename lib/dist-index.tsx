import { parse as parsePath } from "@std/path/posix";

export function distributionIndex(name: string, distributions: URL[]) {
  return (
    <html>
      <head>
        <meta charset="utf8" />
        <title>distributions for {name}</title>
      </head>
      <body>
        <h1>{name} Distribution List</h1>
        <ul>
          {distributions.map((dist) => (
            <li>
              <PkgLink url={dist} />
            </li>
          ))}
        </ul>
      </body>
    </html>
  );
}

function PkgLink({ url }: { url: URL }) {
  let path = url.pathname;
  url.hash = "";
  let parsed = parsePath(path);
  return <a href={encodeURI(url.toString()).replaceAll("+", "%2B")}>{parsed.base}</a>;
}
