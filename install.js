#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const prompts = require("prompts");
const { execSync } = require("child_process");

const DIST_FILE = path.join(__dirname, "dist", "rfm-file.json");

// Installation messages in English (universal standard)
const msg = {
  welcome: "🎉 Welcome to React Form Maker!",
  detectingProject: "🔍 Detecting project type...",
  projectDetected: "📦 Project detected:",
  initializingProject: "🚀 Initializing project...",
  installDependencies: "📦 Installing dependencies...",
  installShadcn: "🎨 Installing Shadcn/ui components...",
  copyingFiles: "📋 Copying ReactFormMaker files...",
  success: "✅ Installation completed successfully!",
  error: "❌ Error:",
  emptyProjectDetected: "📁 Empty project detected.",
  createProject: "Would you like to create a new project?",
  selectProjectType: "What type of project do you want to create?",
  creatingProject: "🏗️ Creating project...",
  projectCreated: "✅ Project created successfully!",
  installationComplete: "🎊 React Form Maker installation complete!",
  nextSteps: "📚 Next steps:",
  checkDocs: "1. Check the documentation in the README",
  runDev: "2. Start your development server",
  testExample: "3. Test the examples in /field-tests",
  enjoyDeveloping: "🚀 Happy developing with React Form Maker!",
};

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

// Vérifier si un composant shadcn est déjà installé
function isShadcnComponentInstalled(componentName, uiPath) {
  if (!uiPath || !fs.existsSync(uiPath)) return false;

  // Mappings pour les noms de fichiers spéciaux
  const fileNameMap = {
    "radio-group": "radio-group.tsx",
    "scroll-area": "scroll-area.tsx",
  };

  const fileName = fileNameMap[componentName] || `${componentName}.tsx`;
  const componentPath = path.join(uiPath, fileName);

  return fs.existsSync(componentPath);
}

// Trouver ou créer le dossier lib (très tolérant)
function findOrCreateLibDir(targetDir) {
  // Nettoyer le targetDir - remplacer @ par src si c'est un alias
  let cleanTargetDir = targetDir;
  if (targetDir === "@" || targetDir.startsWith("@/")) {
    cleanTargetDir = "src";
  }

  const possibleLibPaths = [
    path.join(cleanTargetDir, "lib"),
    path.join(cleanTargetDir, "utils"),
    path.join(cleanTargetDir, "helpers"),
    "src/lib",
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

  // Créer lib dans src par défaut pour les projets Next.js
  const defaultLibPath =
    cleanTargetDir === "src" || fs.existsSync("src")
      ? path.join("src", "lib")
      : path.join(cleanTargetDir, "lib");
  return defaultLibPath;
}

// Mapper nos chemins JSON vers les vrais chemins utilisateur
function mapFilePaths(filePath, targetDir, shadcnConfig, componentsDir) {
  // Nettoyer le targetDir - remplacer @ par src si c'est un alias
  let cleanTargetDir = targetDir;
  if (targetDir === "@" || targetDir.startsWith("@/")) {
    cleanTargetDir = "src";
  }

  if (filePath.startsWith("/lib/")) {
    const libDir = findOrCreateLibDir(cleanTargetDir);
    return path.join(libDir, filePath.replace("/lib/", ""));
  }

  if (filePath.startsWith("/components/ReactFormMaker/")) {
    const componentsPath =
      shadcnConfig.componentsPath ||
      componentsDir.componentsPath ||
      path.join(cleanTargetDir, "components");
    return path.join(componentsPath, filePath.replace("/components/", ""));
  }

  if (filePath.startsWith("/components/ui/")) {
    const uiPath =
      shadcnConfig.uiPath ||
      componentsDir.uiPath ||
      path.join(cleanTargetDir, "components", "ui");
    return path.join(uiPath, filePath.replace("/components/ui/", ""));
  }

  // Fallback: mettre dans cleanTargetDir
  return path.join(cleanTargetDir, filePath.substring(1));
}

async function main() {
  console.log(msg.welcome);
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
  let projectType = detectProjectType();
  let hasTailwind = isPackageInstalled("tailwindcss");
  let hasTailwindMerge = isPackageInstalled("tailwind-merge");
  let hasTailwindConfig = isTailwindConfigured();
  const shadcnConfig = detectShadcnConfig();
  const componentsDir = findComponentsDir();

  // Mode INIT pour projet vide
  if (isEmpty) {
    console.log(msg.emptyProjectDetected);
    const initResponse = await prompts({
      type: "confirm",
      name: "initProject",
      message:
        "Would you like to initialize a complete Next.js + Shadcn/ui project?",
      initial: true,
    });

    if (initResponse.initProject) {
      console.log(`\n${msg.initializingProject}`);
      try {
        execSync(
          "npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias '@/*'",
          { stdio: "inherit" }
        );
        execSync("npx shadcn@latest init", { stdio: "inherit" });

        // Installer les composants shadcn requis
        console.log(msg.installShadcn);
        const initComponents = [
          "button",
          "input",
          "form",
          "select",
          "checkbox",
          "label",
        ];

        // Installation en une seule commande
        console.log(`   Adding components: ${initComponents.join(", ")}...`);
        execSync(`npx shadcn@latest add ${initComponents.join(" ")}`, {
          stdio: "inherit",
        });

        console.log(msg.projectCreated);

        // Relancer les détections après init
        console.log("🔄 Re-analyzing project after initialization...");

        // Attendre un peu que les fichiers soient bien écrits
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Relancer toutes les détections
        projectType = detectProjectType();
        const newHasTailwind = isPackageInstalled("tailwindcss");
        const newHasTailwindMerge = isPackageInstalled("tailwind-merge");
        const newHasTailwindConfig = isTailwindConfigured();
        const newShadcnConfig = detectShadcnConfig();
        const newComponentsDir = findComponentsDir();

        // Mettre à jour toutes les variables
        Object.assign(shadcnConfig, newShadcnConfig);
        Object.assign(componentsDir, newComponentsDir);

        // Mettre à jour les flags Tailwind
        hasTailwind = newHasTailwind;
        hasTailwindMerge = newHasTailwindMerge;
        hasTailwindConfig = newHasTailwindConfig;

        console.log("✅ Project re-analysis completed!");
      } catch (error) {
        console.error("❌ Error during initialization:", error.message);
        process.exit(1);
      }
    } else {
      console.log("❌ Cannot proceed without project initialization.");
      process.exit(0);
    }
  }

  console.log(msg.detectingProject);
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

  // Cette partie sera gérée par installMissingDependencies() plus tard

  // Questions interactives
  const questions = [];

  // Déterminer le dossier cible par défaut
  let defaultTargetDir = "src/components";
  if (shadcnConfig.hasConfig) {
    let componentsPath = shadcnConfig.componentsPath;
    // Remplacer l'alias @ par src
    if (componentsPath.startsWith("@/")) {
      componentsPath = componentsPath.replace("@/", "src/");
    }
    defaultTargetDir = componentsPath;
  } else if (componentsDir.componentsPath) {
    defaultTargetDir = path.dirname(componentsDir.componentsPath);
  }

  // S'assurer que defaultTargetDir ne contient pas d'alias @
  if (defaultTargetDir === "@" || defaultTargetDir.startsWith("@/")) {
    defaultTargetDir = "src/components";
  }

  // Les dépendances sont maintenant gérées automatiquement par installMissingDependencies()

  // Question pour installer les composants shadcn
  const requiredShadcnComponents = [
    "button",
    "input",
    "form",
    "select",
    "checkbox",
    "label",
    "textarea",
    "radio-group",
    "switch",
    "tooltip",
    "carousel",
    "command",
    "popover",
    "calendar",
    "scroll-area",
    "dialog",
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
      message: "Where would you like to install React Form Maker components?",
      initial: defaultTargetDir,
      validate: (value) => {
        if (!value.trim()) return "Path cannot be empty";
        return true;
      },
    },

    {
      type: "confirm",
      name: "overwrite",
      message: "Overwrite existing files?",
      initial: false,
    }
  );

  const response = await prompts(questions);

  if (!response.targetDir) {
    console.log("❌ Installation cancelled.");
    process.exit(0);
  }

  // Force installation of all components (ReactFormMaker needs everything)
  response.components = ["core", "ui", "lib", "enhancements"];

  // Les dépendances sont maintenant installées par installMissingDependencies() dans installFiles()

  // Installer les composants shadcn si demandé
  if (response.installShadcn) {
    console.log("\n🎨 Installing shadcn components...");

    // Filtrer les composants déjà installés
    const componentsDir = findComponentsDir();
    const missingComponents = requiredShadcnComponents.filter((component) => {
      const isInstalled = isShadcnComponentInstalled(
        component,
        componentsDir.uiPath
      );
      if (isInstalled) {
        console.log(`   ✓ ${component} already exists, skipping...`);
        return false;
      }
      return true;
    });

    if (missingComponents.length === 0) {
      console.log("✅ All shadcn components are already installed!");
    } else {
      try {
        // Installation en une seule commande
        console.log(`   Adding components: ${missingComponents.join(", ")}...`);
        execSync(`npx shadcn@latest add ${missingComponents.join(" ")}`, {
          stdio: "inherit",
        });
        console.log("✅ Shadcn components installed successfully!");
      } catch (error) {
        console.error("❌ Error installing shadcn components:", error.message);
        console.log("⚠️  You will need to install them manually:");
        console.log(`   npx shadcn@latest add ${missingComponents.join(" ")}`);
      }
    }
  }

  // Charger les fichiers
  const files = JSON.parse(fs.readFileSync(DIST_FILE, "utf8"));

  // Installer les fichiers
  console.log("\n📁 Installing ReactFormMaker components...");
  await installFiles(
    files,
    response.targetDir,
    response.components,
    response.overwrite,
    shadcnConfig,
    componentsDir
  );

  console.log(`\n${msg.installationComplete}`);
  console.log(`\n${msg.nextSteps}`);
  if (currentLang === "fr") {
    console.log("1. Installez les dépendances requises :");
    console.log("   npm install react-hook-form zod @hookform/resolvers");
    console.log(
      "   npm install @radix-ui/react-select @radix-ui/react-checkbox"
    );
    console.log("   npm install class-variance-authority clsx tailwind-merge");
    console.log("2. Configurez votre projet avec les composants installés");
    console.log("3. Consultez la documentation dans les fichiers installés");
  } else {
    console.log("1. Install required dependencies:");
    console.log("   npm install react-hook-form zod @hookform/resolvers");
    console.log(
      "   npm install @radix-ui/react-select @radix-ui/react-checkbox"
    );
    console.log("   npm install class-variance-authority clsx tailwind-merge");
    console.log("2. Configure your project with the installed components");
    console.log("3. Check the documentation in the installed files");
  }
  console.log(`\n${msg.enjoyDeveloping}`);
}

// Liste des dépendances NPM requises pour ReactFormMaker
const REQUIRED_DEPENDENCIES = {
  dependencies: [
    // Dépendances de base pour ReactFormMaker
    "tailwind-merge",
    "clsx",
    "class-variance-authority",
    "react-hook-form",
    "zod",
    "@hookform/resolvers",
    // Dépendances spécifiques pour les composants avancés
    "@radix-ui/react-icons",
    "@react-hook/resize-observer",
    "react-dropzone",
    "react-phone-number-input",
    "sonner",
    "uuid",
    "date-fns",
    "react-day-picker",
    "libphonenumber-js",
  ],
  devDependencies: ["@types/uuid"],
};

// Fonction pour installer les dépendances NPM manquantes
async function installMissingDependencies() {
  const missingDeps = [];
  const missingDevDeps = [];

  // Vérifier les dépendances manquantes
  REQUIRED_DEPENDENCIES.dependencies.forEach((dep) => {
    if (!isPackageInstalled(dep)) {
      missingDeps.push(dep);
    }
  });

  REQUIRED_DEPENDENCIES.devDependencies.forEach((dep) => {
    if (!isPackageInstalled(dep)) {
      missingDevDeps.push(dep);
    }
  });

  if (missingDeps.length === 0 && missingDevDeps.length === 0) {
    console.log("✅ Toutes les dépendances NPM sont déjà installées");
    return;
  }

  console.log("\n📦 Dépendances NPM manquantes détectées:");
  if (missingDeps.length > 0) {
    console.log(`   Dependencies: ${missingDeps.join(", ")}`);
  }
  if (missingDevDeps.length > 0) {
    console.log(`   DevDependencies: ${missingDevDeps.join(", ")}`);
  }

  const { installDeps } = await prompts({
    type: "confirm",
    name: "installDeps",
    message: "Voulez-vous installer automatiquement ces dépendances ?",
    initial: true,
  });

  if (!installDeps) {
    console.log(
      "⚠️  Installation annulée. Vous devrez installer manuellement :"
    );
    if (missingDeps.length > 0) {
      console.log(`   npm install ${missingDeps.join(" ")}`);
    }
    if (missingDevDeps.length > 0) {
      console.log(`   npm install -D ${missingDevDeps.join(" ")}`);
    }
    return;
  }

  try {
    if (missingDeps.length > 0) {
      console.log("📦 Installation des dépendances...");
      execSync(`npm install ${missingDeps.join(" ")}`, { stdio: "inherit" });
    }

    if (missingDevDeps.length > 0) {
      console.log("📦 Installation des dépendances de développement...");
      execSync(`npm install -D ${missingDevDeps.join(" ")}`, {
        stdio: "inherit",
      });
    }

    console.log("✅ Toutes les dépendances ont été installées avec succès!");
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'installation des dépendances:",
      error.message
    );
    console.log("Vous pouvez les installer manuellement :");
    if (missingDeps.length > 0) {
      console.log(`   npm install ${missingDeps.join(" ")}`);
    }
    if (missingDevDeps.length > 0) {
      console.log(`   npm install -D ${missingDevDeps.join(" ")}`);
    }
  }
}

// Fonction pour créer le fichier utils.ts avec toutes les fonctions utilitaires
function createUtilsFile(targetDir) {
  const libDir = findOrCreateLibDir(targetDir);
  const utilsPath = path.join(libDir, "utils.ts");

  if (fs.existsSync(utilsPath)) {
    // Vérifier si mergeRefs existe déjà
    const existingContent = fs.readFileSync(utilsPath, "utf8");
    if (existingContent.includes("mergeRefs")) {
      console.log("✅ Fichier utils.ts avec mergeRefs déjà existant");
      return;
    } else {
      // Ajouter mergeRefs au fichier existant
      const mergeRefsFunction = `
export function mergeRefs<T = any>(
  ...refs: Array<
    React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null
  >
): React.RefCallback<T> | null {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {},
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return \`\${(bytes / Math.pow(1024, i)).toFixed(decimals)} \${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytes')
      : (sizes[i] ?? 'Bytes')
  }\`;
}
`;

      // Ajouter React import si pas présent
      let updatedContent = existingContent;
      if (!existingContent.includes("import React")) {
        updatedContent = `import React from 'react';\n${updatedContent}`;
      }

      updatedContent += mergeRefsFunction;
      fs.writeFileSync(utilsPath, updatedContent);
      console.log("✅ Fonctions mergeRefs et formatBytes ajoutées à utils.ts");
      return;
    }
  }

  const utilsContent = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import React from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mergeRefs<T = any>(
  ...refs: Array<
    React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null
  >
): React.RefCallback<T> | null {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {},
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return \`\${(bytes / Math.pow(1024, i)).toFixed(decimals)} \${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytes')
      : (sizes[i] ?? 'Bytes')
  }\`;
}
`;

  fs.writeFileSync(utilsPath, utilsContent);
  console.log(
    "✅ Fichier utils.ts créé avec les fonctions utilitaires (cn, mergeRefs, formatBytes)"
  );
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

  // Installer les dépendances NPM manquantes
  await installMissingDependencies();

  // Créer le fichier utils.ts si nécessaire
  if (
    selectedComponents.includes("lib") ||
    selectedComponents.includes("all")
  ) {
    createUtilsFile(targetDir);
  }

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

    // Log discret en gris
    const displayPath = path.relative(process.cwd(), fullPath);
    process.stdout.write(`\x1b[90m   ${displayPath}\x1b[0m\n`);
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
  console.log(
    `\n${msg.error} ${
      currentLang === "fr"
        ? "Installation interrompue par l'utilisateur."
        : "Installation interrupted by user."
    }`
  );
  process.exit(0);
});

process.on("unhandledRejection", (error) => {
  console.error(
    `${msg.error} ${
      currentLang === "fr"
        ? "Erreur lors de l'installation:"
        : "Installation error:"
    } ${error.message}`
  );
  process.exit(1);
});

// Lancer le script principal
main().catch((error) => {
  console.error(`${msg.error} ${error.message}`);
  process.exit(1);
});
