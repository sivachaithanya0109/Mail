// Copies the static web build into dist-mobile/ for Capacitor.
// The build output folder differs between environments, so try the known ones.
import { existsSync, rmSync, cpSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";

const candidates = [
  "dist/client",
  ".output/public",
  ".output/client",
  "dist/public",
  "dist",
];

const source = candidates.find(
  (dir) =>
    existsSync(resolve(dir)) &&
    (existsSync(resolve(dir, "_shell.html")) ||
      existsSync(resolve(dir, "index.html"))),
);

if (!source) {
  console.error(
    `Could not find the web build output. Looked in: ${candidates.join(", ")}`,
  );
  process.exit(1);
}

const target = resolve("dist-mobile");
rmSync(target, { recursive: true, force: true });
cpSync(resolve(source), target, { recursive: true });

if (!existsSync(resolve(target, "index.html"))) {
  copyFileSync(resolve(target, "_shell.html"), resolve(target, "index.html"));
}

console.log(`dist-mobile ready (from ${source})`);
