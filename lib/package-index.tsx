export function packageIndex(packages: string[], title: string) {
  return (
    <html>
      <head>
        <meta charset="utf8" />
        <title>{title} package list</title>
      </head>
      <body>
        <h1>{title} Package List</h1>
        <ul>
          {packages.map((pkg) => (
            <li>
              <a href={`${pkg}/`}>{pkg}</a>
            </li>
          ))}
        </ul>
      </body>
    </html>
  );
}
