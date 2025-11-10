#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const prompts = require("prompts");
const { execSync } = require("child_process");

const DIST_FILE = path.join(__dirname, "dist", "rfm-file.json");

// Check if project is empty or minimal
function isEmptyProject() {
  return (
    !fs.existsSync("package.json") ||
    (!fs.existsSync("src") &&
      !fs.existsSync("app") &&
      !fs.existsSync("components"))
  );
}

// Check if a package is installed
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
      "❌ Distribution file not found. Please generate files first with npm run build."
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
    console.log("🆕 Empty project detected - INIT mode available");
    const initResponse = await prompts({
      type: "confirm",
      name: "initProject",
      message:
        "Would you like to initialize a complete Next.js + Shadcn/ui project?",
      initial: true,
    });

    if (initResponse.initProject) {
      console.log("\n🏗️  Initializing project...");
      try {
        execSync(
          "npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias '@/*'",
          { stdio: "inherit" }
        );
        execSync("npx shadcn@latest init", { stdio: "inherit" });
        console.log("✅ Next.js + Shadcn project initialized!");

        // Relancer les détections après init
        const newProjectType = detectProjectType();
        const newShadcnConfig = detectShadcnConfig();
        const newComponentsDir = findComponentsDir();

        // Mettre à jour les variables
        Object.assign(shadcnConfig, newShadcnConfig);
        Object.assign(componentsDir, newComponentsDir);
      } catch (error) {
        console.error("❌ Error during initialization:", error.message);
        process.exit(1);
      }
    }
  }

  console.log("📋 Analyzing your project:");
  console.log(`   Type: ${projectType}`);
  console.log(`   Tailwind CSS: ${hasTailwind ? "✅" : "❌"}`);
  console.log(`   Tailwind Merge: ${hasTailwindMerge ? "✅" : "❌"}`);
  console.log(`   Tailwind Config: ${hasTailwindConfig ? "✅" : "❌"}`);
  console.log(`   Shadcn Config: ${shadcnConfig.hasConfig ? "✅" : "❌"}`);
  if (shadcnConfig.hasConfig) {
    console.log(`   UI Path: ${shadcnConfig.uiPath}`);
    console.log(`   Components Path: ${shadcnConfig.componentsPath}`);
  } else if (componentsDir.componentsPath) {
    console.log(`   Components found: ${componentsDir.componentsPath}`);
    console.log(`   UI Path: ${componentsDir.uiPath || "not found"}`);
  }
  console.log("");

  // Vérifier les prérequis
  if (!hasTailwind) {
    console.error(
      "❌ Tailwind CSS is not installed. ReactFormMaker requires Tailwind CSS."
    );
    console.log(
      "📖 Please install Tailwind first: https://tailwindcss.com/docs/installation"
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
      message: `Install missing dependencies? (${missingDeps.join(", ")})`,
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
    message: `Install required shadcn components? (${requiredShadcnComponents.join(
      ", "
    )})`,
    initial: !shadcnConfig.hasConfig, // Par défaut oui si pas de config shadcn
  });

  questions.push(
    {
      type: "text",
      name: "targetDir",
      message: "In which folder would you like to install React Form Maker?",
      initial: defaultTargetDir,
      validate: (value) => {
        if (!value.trim()) return "Path cannot be empty";
        return true;
      },
    },
    {
      type: "multiselect",
      name: "components",
      message: "Which components would you like to install?",
      choices: [
        {
          title: "ReactFormMaker (Core component)",
          value: "core",
          selected: true,
        },
        {
          title: "UI Components (Typography, etc.)",
          value: "ui",
          selected: true,
        },
        { title: "Utilities (lib)", value: "lib", selected: true },
        {
          title: "Enhancements (Advanced components)",
          value: "enhancements",
          selected: false,
        },
      ],
      min: 1,
    },
    {
      type: "confirm",
      name: "overwrite",
      message: "Overwrite existing files?",
      initial: false,
    }
  );

  const response = await prompts(questions);

  if (!response.targetDir || !response.components) {
    console.log("❌ Installation cancelled.");
    process.exit(0);
  }

  // Installer les dépendances manquantes si demandé
  if (response.installDeps && missingDeps.length > 0) {
    console.log("\n📦 Installing dependencies...");
    try {
      const packageManager = fs.existsSync("yarn.lock")
        ? "yarn add"
        : "npm install";
      execSync(`${packageManager} ${missingDeps.join(" ")}`, {
        stdio: "inherit",
      });
      console.log("✅ Dependencies installed successfully!");
    } catch (error) {
      console.error("❌ Error installing dependencies:", error.message);
      console.log("⚠️  You will need to install them manually:");
      console.log(
        `   ${missingDeps.map((dep) => `npm install ${dep}`).join("\n   ")}`
      );
    }
  }

  // Installer les composants shadcn si demandé
  if (response.installShadcn) {
    console.log("\n🎨 Installing shadcn components...");
    try {
      for (const component of requiredShadcnComponents) {
        console.log(`   Adding ${component}...`);
        execSync(`npx shadcn@latest add ${component}`, { stdio: "inherit" });
      }
      console.log("✅ Shadcn components installed successfully!");
    } catch (error) {
      console.error("❌ Error installing shadcn components:", error.message);
      console.log("⚠️  You will need to install them manually:");
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

  console.log("\n✅ Installation completed!");
  console.log("\n📖 Next steps:");
  console.log("1. Install required dependencies:");
  console.log("   npm install react-hook-form zod @hookform/resolvers");
  console.log("   npm install @radix-ui/react-select @radix-ui/react-checkbox");
  console.log("   npm install class-variance-authority clsx tailwind-merge");
  console.log("2. Configure your project with the installed components");
  console.log("3. Check the documentation in the installed files");
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
        `⚠️  Existing file skipped: ${path.relative(process.cwd(), fullPath)}`
      );
      skippedCount++;
      continue;
    }

    // Écrire le fichier
    fs.writeFileSync(fullPath, content, "utf8");
    console.log(`✅ Installed: ${path.relative(process.cwd(), fullPath)}`);
    installedCount++;
  }

  console.log(
    `\n📊 Summary: ${installedCount} files installed, ${skippedCount} skipped`
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
