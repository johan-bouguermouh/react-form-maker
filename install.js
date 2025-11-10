#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const prompts = require("prompts");
const { execSync } = require("child_process");

const DIST_FILE = path.join(__dirname, "dist", "rfm-file.json");

// Vérifier si le projet est vide ou minimal
function isEmptyProject() {
  return (
    !fs.existsSync("package.json") ||
    (!fs.existsSync("src") &&
      !fs.existsSync("app") &&
      !fs.existsSync("components"))
  );
}

// Vérifier si un package est installé
function isPackageInstalled(packageName) {
  try {
    const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));
    return !!(
      packageJson.dependencies?.[packageName] ||
      packageJson.devDependencies?.[packageName]
    );
  } catch {
    return false;
  }
}

// Vérifier si Tailwind est configuré
function isTailwindConfigured() {
  const configFiles = [
    "tailwind.config.js",
    "tailwind.config.ts",
    "tailwind.config.mjs",
  ];
  return configFiles.some((file) => fs.existsSync(file));
}

// Détecter le type de projet
function detectProjectType() {
  if (fs.existsSync("next.config.js") || fs.existsSync("next.config.mjs"))
    return "next";
  if (fs.existsSync("vite.config.js") || fs.existsSync("vite.config.ts"))
    return "vite";
  if (fs.existsSync("src/App.js") || fs.existsSync("src/App.tsx")) return "cra";
  return "unknown";
}

// Détecter la configuration shadcn/ui
function detectShadcnConfig() {
  if (fs.existsSync("components.json")) {
    try {
      const config = JSON.parse(fs.readFileSync("components.json", "utf8"));
      return {
        hasConfig: true,
        uiPath: config.ui || "src/components/ui",
        componentsPath: config.aliases?.components || "src/components",
      };
    } catch {
      return { hasConfig: false };
    }
  }
  return { hasConfig: false };
}

// Chercher le dossier components/ui dans le projet (très tolérant)
function findComponentsDir() {
  const possiblePaths = [
    "src/components",
    "src/component",
    "components",
    "component",
    "app/components",
    "app/component",
    "lib/components",
    "lib/component",
  ];

  for (const dir of possiblePaths) {
    if (fs.existsSync(dir)) {
      // Vérifier s'il y a un sous-dossier ui
      const uiPath = path.join(dir, "ui");
      return {
        componentsPath: dir,
        uiPath: fs.existsSync(uiPath) ? uiPath : null,
      };
    }
  }

  return { componentsPath: null, uiPath: null };
}

// Trouver ou créer le dossier lib (très tolérant)
function findOrCreateLibDir(targetDir) {
  const possibleLibPaths = [
    path.join(targetDir, "lib"),
    path.join(targetDir, "utils"),
    path.join(targetDir, "helpers"),
    "lib",
    "utils",
    "helpers",
  ];

  // Chercher un dossier lib existant
  for (const libPath of possibleLibPaths) {
    if (fs.existsSync(libPath)) {
      return libPath;
    }
  }

  // Créer lib dans le targetDir par défaut
  const defaultLibPath = path.join(targetDir, "lib");
  return defaultLibPath;
}

// Mapper nos chemins JSON vers les vrais chemins utilisateur
function mapFilePaths(filePath, targetDir, shadcnConfig, componentsDir) {
  if (filePath.startsWith("/lib/")) {
    const libDir = findOrCreateLibDir(targetDir);
    return path.join(libDir, filePath.replace("/lib/", ""));
  }

  if (filePath.startsWith("/components/ReactFormMaker/")) {
    const componentsPath =
      shadcnConfig.componentsPath ||
      componentsDir.componentsPath ||
      path.join(targetDir, "components");
    return path.join(componentsPath, filePath.replace("/components/", ""));
  }

  if (filePath.startsWith("/components/ui/")) {
    const uiPath =
      shadcnConfig.uiPath ||
      componentsDir.uiPath ||
      path.join(targetDir, "components", "ui");
    return path.join(uiPath, filePath.replace("/components/ui/", ""));
  }

  // Fallback: mettre dans targetDir
  return path.join(targetDir, filePath.substring(1));
}

async function main() {
  console.log("🚀 React Form Maker - Installation");
  console.log("===================================\n");

  // Vérifier si le fichier de distribution existe
  if (!fs.existsSync(DIST_FILE)) {
    console.error(
      "❌ Fichier de distribution non trouvé. Veuillez d'abord générer les fichiers avec npm run build."
    );
    process.exit(1);
  }

  // Vérifications de l'environnement
  const isEmpty = isEmptyProject();
  const projectType = detectProjectType();
  const hasTailwind = isPackageInstalled("tailwindcss");
  const hasTailwindMerge = isPackageInstalled("tailwind-merge");
  const hasTailwindConfig = isTailwindConfigured();
  const shadcnConfig = detectShadcnConfig();
  const componentsDir = findComponentsDir();

  // Mode INIT pour projet vide
  if (isEmpty) {
    console.log("🆕 Projet vide détecté - Mode INIT disponible");
    const initResponse = await prompts({
      type: "confirm",
      name: "initProject",
      message: "Voulez-vous initialiser un projet Next.js + Shadcn/ui complet?",
      initial: true,
    });

    if (initResponse.initProject) {
      console.log("\n🏗️  Initialisation du projet...");
      try {
        execSync(
          "npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias '@/*'",
          { stdio: "inherit" }
        );
        execSync("npx shadcn@latest init", { stdio: "inherit" });
        console.log("✅ Projet Next.js + Shadcn initialisé!");

        // Relancer les détections après init
        const newProjectType = detectProjectType();
        const newShadcnConfig = detectShadcnConfig();
        const newComponentsDir = findComponentsDir();

        // Mettre à jour les variables
        Object.assign(shadcnConfig, newShadcnConfig);
        Object.assign(componentsDir, newComponentsDir);
      } catch (error) {
        console.error("❌ Erreur lors de l'initialisation:", error.message);
        process.exit(1);
      }
    }
  }

  console.log("📋 Analyse de votre projet:");
  console.log(`   Type: ${projectType}`);
  console.log(`   Tailwind CSS: ${hasTailwind ? "✅" : "❌"}`);
  console.log(`   Tailwind Merge: ${hasTailwindMerge ? "✅" : "❌"}`);
  console.log(`   Config Tailwind: ${hasTailwindConfig ? "✅" : "❌"}`);
  console.log(`   Shadcn Config: ${shadcnConfig.hasConfig ? "✅" : "❌"}`);
  if (shadcnConfig.hasConfig) {
    console.log(`   UI Path: ${shadcnConfig.uiPath}`);
    console.log(`   Components Path: ${shadcnConfig.componentsPath}`);
  } else if (componentsDir.componentsPath) {
    console.log(`   Components trouvés: ${componentsDir.componentsPath}`);
    console.log(`   UI Path: ${componentsDir.uiPath || "non trouvé"}`);
  }
  console.log("");

  // Vérifier les prérequis
  if (!hasTailwind) {
    console.error(
      "❌ Tailwind CSS n'est pas installé. ReactFormMaker nécessite Tailwind CSS."
    );
    console.log(
      "📖 Installez d'abord Tailwind: https://tailwindcss.com/docs/installation"
    );
    process.exit(1);
  }

  // Lister les dépendances manquantes
  const missingDeps = [];
  const requiredDeps = [
    "tailwind-merge",
    "clsx",
    "class-variance-authority",
    "react-hook-form",
    "zod",
    "@hookform/resolvers",
  ];

  requiredDeps.forEach((dep) => {
    if (!isPackageInstalled(dep)) {
      missingDeps.push(dep);
    }
  });

  // Questions interactives
  const questions = [];

  // Déterminer le dossier cible par défaut
  let defaultTargetDir = "./src";
  if (shadcnConfig.hasConfig) {
    defaultTargetDir = path.dirname(shadcnConfig.componentsPath);
  } else if (componentsDir.componentsPath) {
    defaultTargetDir = path.dirname(componentsDir.componentsPath);
  }

  // Question pour installer les dépendances
  if (missingDeps.length > 0) {
    questions.push({
      type: "confirm",
      name: "installDeps",
      message: `Installer les dépendances manquantes? (${missingDeps.join(
        ", "
      )})`,
      initial: true,
    });
  }

  // Question pour installer les composants shadcn
  const requiredShadcnComponents = [
    "button",
    "input",
    "form",
    "select",
    "checkbox",
    "label",
  ];
  questions.push({
    type: "confirm",
    name: "installShadcn",
    message: `Installer les composants shadcn requis? (${requiredShadcnComponents.join(
      ", "
    )})`,
    initial: !shadcnConfig.hasConfig, // Par défaut oui si pas de config shadcn
  });

  questions.push(
    {
      type: "text",
      name: "targetDir",
      message: "Dans quel dossier souhaitez-vous installer React Form Maker?",
      initial: defaultTargetDir,
      validate: (value) => {
        if (!value.trim()) return "Le chemin ne peut pas être vide";
        return true;
      },
    },
    {
      type: "multiselect",
      name: "components",
      message: "Quels composants souhaitez-vous installer?",
      choices: [
        {
          title: "ReactFormMaker (Composant principal)",
          value: "core",
          selected: true,
        },
        {
          title: "Composants UI (Typography, etc.)",
          value: "ui",
          selected: true,
        },
        { title: "Utilitaires (lib)", value: "lib", selected: true },
        {
          title: "Enhancements (Composants avancés)",
          value: "enhancements",
          selected: false,
        },
      ],
      min: 1,
    },
    {
      type: "confirm",
      name: "overwrite",
      message: "Écraser les fichiers existants?",
      initial: false,
    }
  );

  const response = await prompts(questions);

  if (!response.targetDir || !response.components) {
    console.log("❌ Installation annulée.");
    process.exit(0);
  }

  // Installer les dépendances manquantes si demandé
  if (response.installDeps && missingDeps.length > 0) {
    console.log("\n📦 Installation des dépendances...");
    try {
      const packageManager = fs.existsSync("yarn.lock")
        ? "yarn add"
        : "npm install";
      execSync(`${packageManager} ${missingDeps.join(" ")}`, {
        stdio: "inherit",
      });
      console.log("✅ Dépendances installées avec succès!");
    } catch (error) {
      console.error(
        "❌ Erreur lors de l'installation des dépendances:",
        error.message
      );
      console.log("⚠️  Vous devrez les installer manuellement:");
      console.log(
        `   ${missingDeps.map((dep) => `npm install ${dep}`).join("\n   ")}`
      );
    }
  }

  // Installer les composants shadcn si demandé
  if (response.installShadcn) {
    console.log("\n🎨 Installation des composants shadcn...");
    try {
      for (const component of requiredShadcnComponents) {
        console.log(`   Ajout de ${component}...`);
        execSync(`npx shadcn@latest add ${component}`, { stdio: "inherit" });
      }
      console.log("✅ Composants shadcn installés avec succès!");
    } catch (error) {
      console.error(
        "❌ Erreur lors de l'installation des composants shadcn:",
        error.message
      );
      console.log("⚠️  Vous devrez les installer manuellement:");
      console.log(
        `   ${requiredShadcnComponents
          .map((comp) => `npx shadcn@latest add ${comp}`)
          .join("\n   ")}`
      );
    }
  }

  // Charger les fichiers
  const files = JSON.parse(fs.readFileSync(DIST_FILE, "utf8"));

  // Installer les fichiers
  await installFiles(
    files,
    response.targetDir,
    response.components,
    response.overwrite,
    shadcnConfig,
    componentsDir
  );

  console.log("\n✅ Installation terminée!");
  console.log("\n📖 Prochaines étapes:");
  console.log("1. Installez les dépendances requises:");
  console.log("   npm install react-hook-form zod @hookform/resolvers");
  console.log("   npm install @radix-ui/react-select @radix-ui/react-checkbox");
  console.log("   npm install class-variance-authority clsx tailwind-merge");
  console.log("2. Configurez votre projet avec les composants installés");
  console.log("3. Consultez la documentation dans les fichiers installés");
}

async function installFiles(
  files,
  targetDir,
  selectedComponents,
  overwrite,
  shadcnConfig = {},
  componentsDir = {}
) {
  let installedCount = 0;
  let skippedCount = 0;

  for (const [relativePath, content] of Object.entries(files)) {
    // Filtrer selon les composants sélectionnés
    if (!shouldInstallFile(relativePath, selectedComponents)) {
      continue;
    }

    // Mapper le chemin JSON vers le vrai chemin utilisateur
    const fullPath = mapFilePaths(
      relativePath,
      targetDir,
      shadcnConfig,
      componentsDir
    );
    const dir = path.dirname(fullPath);

    // Créer les dossiers nécessaires
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Vérifier si le fichier existe déjà
    if (fs.existsSync(fullPath) && !overwrite) {
      console.log(
        `⚠️  Fichier existant ignoré: ${path.relative(process.cwd(), fullPath)}`
      );
      skippedCount++;
      continue;
    }

    // Écrire le fichier
    fs.writeFileSync(fullPath, content, "utf8");
    console.log(`✅ Installé: ${relativePath}`);
    installedCount++;
  }

  console.log(
    `\n📊 Résumé: ${installedCount} fichiers installés, ${skippedCount} ignorés`
  );
}

function shouldInstallFile(filePath, selectedComponents) {
  // Composant principal
  if (
    selectedComponents.includes("core") &&
    filePath.includes("/ReactFormMaker/")
  ) {
    // Exclure les enhancements si non sélectionnés
    if (
      filePath.includes("/enhancements/") &&
      !selectedComponents.includes("enhancements")
    ) {
      return false;
    }
    return true;
  }

  // Composants UI
  if (
    selectedComponents.includes("ui") &&
    filePath.includes("/components/ui/")
  ) {
    return true;
  }

  // Utilitaires
  if (selectedComponents.includes("lib") && filePath.includes("/lib/")) {
    return true;
  }

  return false;
}

// Gestion des erreurs
process.on("SIGINT", () => {
  console.log("\n❌ Installation interrompue par l'utilisateur.");
  process.exit(0);
});

process.on("unhandledRejection", (error) => {
  console.error("❌ Erreur lors de l'installation:", error.message);
  process.exit(1);
});

// Lancer le script principal
main().catch((error) => {
  console.error("❌ Erreur:", error.message);
  process.exit(1);
});
