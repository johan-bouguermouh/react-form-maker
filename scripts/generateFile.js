const fs = require("fs");
const path = require("path");

// Tableau des chemins à exclure de la génération
const EXCLUDE_PATHS = ["/lib/zodRFM/*", "/lib/zodRFM/"];

// Fonction pour vérifier si un chemin doit être exclu
function shouldExclude(filePath) {
  return EXCLUDE_PATHS.some((excludePattern) => {
    if (excludePattern.endsWith("/*")) {
      const basePath = excludePattern.slice(0, -2);
      return filePath.startsWith(basePath);
    }
    return filePath === excludePattern || filePath.startsWith(excludePattern);
  });
}

function walk(dir, fileList = {}, baseDir = dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, fileList, baseDir);
    } else {
      const relPath =
        "/" + path.relative(baseDir, fullPath).replace(/\\/g, "/");

      // Vérifier si le fichier doit être exclu
      if (!shouldExclude(relPath)) {
        fileList[relPath] = fs.readFileSync(fullPath, "utf8");
      } else {
        console.log(`Exclu: ${relPath}`);
      }
    }
  });
  return fileList;
}

const root = path.resolve(__dirname, "..");
const reactFormMakerDir = path.join(
  root,
  "frontend",
  "src",
  "components",
  "ReactFormMaker"
);

const libDir = path.join(root, "frontend", "src", "lib");
const uiDir = path.join(root, "frontend", "src", "components", "ui");

let files = {};
if (fs.existsSync(reactFormMakerDir)) {
  files = { ...files, ...walk(reactFormMakerDir, {}, reactFormMakerDir) };
}
if (fs.existsSync(libDir)) {
  files = { ...files, ...walk(libDir, {}, libDir) };
}
//si uidir on récupère seulement le fichier Typography.tsx
const typographyFile = path.join(uiDir, "Typography.tsx");
if (fs.existsSync(typographyFile)) {
  files["/components/ui/Typography.tsx"] = fs.readFileSync(
    typographyFile,
    "utf8"
  );
}

const prefixedFiles = {};

Object.keys(files).forEach((relPath) => {
  let content = files[relPath];

  if (relPath.startsWith("/")) {
    if (fs.existsSync(path.join(reactFormMakerDir, relPath))) {
      prefixedFiles["/ReactFormMaker" + relPath] = content;
    } else if (relPath.startsWith("/components/ui/")) {
      prefixedFiles[relPath] = content;
    } else {
      prefixedFiles["/lib" + relPath] = content;
    }
  }
});

// Créer le dossier dist s'il n'existe pas
const distDir = path.resolve(root, "./dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync(
  path.resolve(root, "./dist/rfm-file.json"),
  JSON.stringify(prefixedFiles, null, 2)
);

console.log("Fichiers exportés pour Sandpack !");
