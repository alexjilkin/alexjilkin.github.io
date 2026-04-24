import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const outDir = resolve(root, "assets/vendor");

const copyFile = (src, dest) => {
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest);
};

rmSync(outDir, { recursive: true, force: true });

copyFile(
  resolve(root, "node_modules/three/build/three.module.js"),
  resolve(outDir, "three/three.module.js")
);

copyFile(
  resolve(root, "node_modules/lammps.js/dist/client.js"),
  resolve(outDir, "lammps.js/client.js")
);

copyFile(
  resolve(root, "node_modules/lammps.js/dist/cpp/lammps.js"),
  resolve(outDir, "lammps.js/cpp/lammps.js")
);

console.log("Copied browser simulation dependencies to assets/vendor");
