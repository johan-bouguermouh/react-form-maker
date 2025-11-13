#!/usr/bin/env node
const recast = require("recast");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const https = require("https");
const prompts = require("prompts");
const configureVitePlugin = require("./scripts/install/fixConfigVite");

const DIST_FILE = path.join(__dirname, "dist", "rfm-file.json");

// Verify that the distribution file exists
if (!fs.existsSync(DIST_FILE)) {
  console.error(
    "❌ We have a probleme with distribution file for own package. If problem persists, please contact the author."
  );
  process.exit(1);
}

/**
 * ANSI color codes pour les messages
 * */
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

/**
 * Localized messages for cli
 */
const msg = {
  welcome: "🚀 ReactFormMaker - Installation and Configuration",
  projectAnalysis: "🔍 Analyzing project...",
  projectType: "Detected project type",
  tailwindFound: "Tailwind CSS found",
  tailwindNotFound: "Tailwind CSS not found",
  shadcnFound: "Shadcn/ui configured",
  shadcnNotFound: "Shadcn/ui not configured",
  componentsDirFound: "Components directory",
  installationComplete: "✅ ReactFormMaker installation completed!",
  enjoyDeveloping: "🎉 Happy coding with ReactFormMaker!",
  nextSteps: "📋 Next steps:",
  checkDocs: "1. Check the documentation in the installed files",
  configureProject: "2. Configure your project with the installed components",
  installMissingDeps: "3. Install missing dependencies if needed",
  error: "❌ Error",
  emptyProjectDetected: "📁 Empty project detected.",
  initializingProject: "🚀 Initializing project...",
  projectCreated: "✅ Project created successfully!",
};

/**
 *  List of NPM dependencies required for ReactFormMaker
 */
const REQUIRED_DEPENDENCIES = {
  dependencies: [
    // Base dependencies for ReactFormMaker
    "tailwind-merge",
    "clsx",
    "class-variance-authority",
    "react-hook-form",
    "zod",
    "@hookform/resolvers",
    // Specific dependencies for advanced components
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

/**
 * List of required shadcn components for ReactFormMaker
 */
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

/** default target dir to src/components */
let defaultTargetDir = "src/components";

console.log(`${colors.cyan}${colors.bright}${msg.welcome}${colors.reset}\n`);

// Fonctions utilitaires pour détecter l'environnement du projet

/**
 * Verify if is empty project or if we installed in a project
 */
function isEmptyProject() {
  return (
    !fs.existsSync("package.json") ||
    (!fs.existsSync("src") &&
      !fs.existsSync("app") &&
      !fs.existsSync("components"))
  );
}

/**
 * Vérifie si un package est installé
 */
function isPackageInstalled(packageName) {
  try {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    if (!fs.existsSync(packageJsonPath)) return false;

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    return !!(
      (packageJson.dependencies && packageJson.dependencies[packageName]) ||
      (packageJson.devDependencies && packageJson.devDependencies[packageName])
    );
  } catch (error) {
    return false;
  }
}

/**
 * Détecte le type de projet React
 */
function detectProjectType() {
  // Vérifier Next.js
  if (
    isPackageInstalled("next") ||
    fs.existsSync("next.config.js") ||
    fs.existsSync("next.config.mjs") ||
    fs.existsSync("next.config.ts")
  ) {
    return "next";
  }

  // Vérifier Vite
  if (
    isPackageInstalled("vite") ||
    fs.existsSync("vite.config.js") ||
    fs.existsSync("vite.config.ts") ||
    fs.existsSync("vite.config.mjs")
  ) {
    return "vite";
  }

  // Vérifier Create React App
  if (isPackageInstalled("react-scripts")) {
    return "cra";
  }

  return "other";
}

/**
 * Détecte la méthode d'installation de Tailwind appropriée
 */
function detectTailwindInstallationMethod(projectType) {
  const hasVitePlugin = isPackageInstalled("@tailwindcss/vite");
  const hasTraditionalTailwind = isPackageInstalled("tailwindcss");

  let method = "traditional"; // Par défaut PostCSS

  if (projectType === "vite" && !hasTraditionalTailwind) {
    method = "vite-plugin";
  }

  return {
    hasVitePlugin,
    hasTraditionalTailwind,
    method,
    hasAnyTailwind: hasVitePlugin || hasTraditionalTailwind,
  };
}

/**
 * Vérifie si Tailwind CSS est configuré
 */
function isTailwindConfigured() {
  return (
    fs.existsSync("tailwind.config.js") ||
    fs.existsSync("tailwind.config.ts") ||
    fs.existsSync("tailwind.config.mjs")
  );
}

/**
 * Détecte la configuration Shadcn/ui
 */
function detectShadcnConfig() {
  const configPaths = ["components.json", ".shadcnui.json", "shadcn.json"];

  for (const configPath of configPaths) {
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
        /** we verify if config contain componentsPath key */
        return {
          hasConfig: true,
          configPath,
          config,
        };
      } catch (error) {
        // Configuration invalide, continuer la recherche
        return { hasConfig: false };
      }
    }
  }

  return { hasConfig: false };
}

/**
 * Find shadcn components directory
 */
function findComponentsDir() {
  const possibleDirs = [
    "src/components",
    "components",
    "app/components",
    "src/app/components",
  ];

  for (const dir of possibleDirs) {
    if (fs.existsSync(dir)) {
      return { exists: true, path: dir };
    }
  }

  console.debug("No components directory found for shadcn/ui.");

  return { exists: false, path: "src/" };
}

/**
 * Configure l'import CSS de Tailwind
 */
async function configureTailwindCSS() {
  console.log("🎨 Adding Tailwind CSS import to global CSS...");

  // Chercher le fichier CSS global
  const possibleCssFiles = [
    "src/index.css",
    "src/App.css",
    "src/main.css",
    "src/global.css",
    "src/globals.css",
    "src/app/globals.css",
  ];

  let cssPath = null;
  for (const cssFile of possibleCssFiles) {
    if (fs.existsSync(cssFile)) {
      cssPath = cssFile;
      break;
    }
  }

  if (cssPath) {
    let cssContent = fs.readFileSync(cssPath, "utf8");
    const tailwindImport = '@import "tailwindcss";';

    if (
      !cssContent.includes(tailwindImport) &&
      !cssContent.includes("@tailwind")
    ) {
      cssContent = tailwindImport + "\n\n" + cssContent;
      fs.writeFileSync(cssPath, cssContent);
      console.log(`✅ Added Tailwind CSS import to ${cssPath}`);
    } else {
      console.log(`✅ Tailwind CSS import already exists in ${cssPath}`);
    }
  } else {
    console.log("⚠️  No global CSS file found, creating src/index.css...");
    const cssContent = '@import "tailwindcss";\n';
    fs.mkdirSync("src", { recursive: true });
    fs.writeFileSync("src/index.css", cssContent);
    console.log("✅ Created src/index.css with Tailwind CSS import");
  }
}

/**
 * Configure les alias TypeScript
 */
async function configureTypeScriptAliases() {
  console.log("🔧 Configuring import aliases...");

  // Configuration pour tsconfig.json
  const tsconfigPath = "tsconfig.json";
  let tsconfig;
  if (fs.existsSync(tsconfigPath)) {
    try {
      let raw = fs.readFileSync(tsconfigPath, "utf8");
      // Supprimer les commentaires (// ou /* ... */)
      raw = raw.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");
      tsconfig = JSON.parse(raw);
    } catch (e) {
      console.error(
        "❌ Erreur de parsing tsconfig.json, création d'un nouveau fichier minimal."
      );
      tsconfig = {};
    }
  } else {
    tsconfig = {};
  }
  if (!tsconfig.compilerOptions) tsconfig.compilerOptions = {};
  // Merge non destructif : on ajoute ou met à jour uniquement baseUrl et paths
  if (!tsconfig.compilerOptions.baseUrl) tsconfig.compilerOptions.baseUrl = ".";
  if (!tsconfig.compilerOptions.paths) tsconfig.compilerOptions.paths = {};
  tsconfig.compilerOptions.paths["@/*"] = tsconfig.compilerOptions.paths[
    "@/*"
  ] || ["./src/*"];
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  console.log(
    "✅ TypeScript aliases configurés dans tsconfig.json (merge non destructif)"
  );

  // Configuration pour tsconfig.app.json (spécifique aux nouveaux projets Vite)
  const tsconfigAppPath = "tsconfig.app.json";
  let tsconfigApp;
  if (fs.existsSync(tsconfigAppPath)) {
    try {
      let raw = fs.readFileSync(tsconfigAppPath, "utf8");
      // Supprimer les commentaires (// ou /* ... */)
      raw = raw.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");
      tsconfigApp = JSON.parse(raw);
    } catch (e) {
      console.error(
        "❌ Erreur de parsing tsconfig.app.json, création d'un nouveau fichier minimal."
      );
      tsconfigApp = {};
    }
  } else {
    tsconfigApp = {};
  }
  if (!tsconfigApp.compilerOptions) tsconfigApp.compilerOptions = {};
  // Merge non destructif : on ajoute ou met à jour uniquement baseUrl et paths
  if (!tsconfigApp.compilerOptions.baseUrl)
    tsconfigApp.compilerOptions.baseUrl = ".";
  if (!tsconfigApp.compilerOptions.paths)
    tsconfigApp.compilerOptions.paths = {};
  tsconfigApp.compilerOptions.paths["@/*"] = tsconfigApp.compilerOptions.paths[
    "@/*"
  ] || ["./src/*"];
  fs.writeFileSync(tsconfigAppPath, JSON.stringify(tsconfigApp, null, 2));
  console.log(
    "✅ TypeScript aliases configurés dans tsconfig.app.json (merge non destructif)"
  );
}

/**
 * Installe Tailwind CSS avec le plugin Vite
 */
async function installTailwindVitePlugin() {
  console.log("📦 Installing Tailwind CSS with Vite plugin...");

  // Installation du plugin Vite pour Tailwind et des types Node.js
  execSync("npm install -D tailwindcss  @tailwindcss/vite @types/node", {
    stdio: "inherit",
  }); // Configuration du plugin Vite
  await configureVitePlugin();

  // Configuration du CSS
  await configureTailwindCSS();

  // Configuration des alias TypeScript
  await configureTypeScriptAliases();
}

/**
 * Installe Tailwind CSS avec PostCSS (méthode traditionnelle)
 */
async function installTailwindPostCSS(projectType = "other") {
  console.log("📦 Installing Tailwind CSS with PostCSS...");

  // Installation des packages traditionnels
  execSync("npm install -D tailwindcss postcss autoprefixer", {
    stdio: "inherit",
  });

  // Initialisation de la configuration
  execSync("npx tailwindcss init -p", { stdio: "inherit" });

  // Configuration du CSS
  await configureTailwindCSS();

  // Configuration des alias TypeScript
  await configureTypeScriptAliases();

  console.log("✅ Tailwind CSS installed with PostCSS method");
}

// Fonction principale d'installation
async function main() {
  try {
    console.log(`${msg.projectAnalysis}`);

    // Vérifications de l'environnement
    const isEmpty = isEmptyProject();
    // Détecter l'environnement du projet
    let projectType = detectProjectType();
    const tailwindDetection = detectTailwindInstallationMethod(projectType);
    let hasTailwind = tailwindDetection.hasAnyTailwind;
    let hasTailwindConfig = isTailwindConfigured();
    let shadcnConfig = detectShadcnConfig();
    let componentsDir = findComponentsDir();

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

    // Afficher l'état du projet
    console.group("Analysis Results of the project");
    console.log(`\n📋 Project Status:`);
    console.log(`   ${msg.projectType}: ${projectType}`);
    console.log(`   Tailwind CSS: ${hasTailwind ? "✅" : "❌"}`);
    if (hasTailwind) {
      console.log(`   Installation Method: ${tailwindDetection.method}`);
    }
    console.log(`   Tailwind Config: ${hasTailwindConfig ? "✅" : "❌"}`);
    console.log(`   Shadcn Config: ${shadcnConfig.hasConfig ? "✅" : "❌"}`);
    console.log(
      `   Components Dir: ${componentsDir.exists ? "✅" : "❌"} (${
        componentsDir.path
      })`
    );
    console.groupEnd();

    // Installer Tailwind CSS si nécessaire
    if (!hasTailwind) {
      console.log(
        "\n⚠️  Tailwind CSS is not installed. ReactFormMaker requires Tailwind CSS."
      );
      const installTailwindResponse = await prompts({
        type: "confirm",
        name: "installTailwind",
        message:
          "Would you like to install Tailwind CSS with Shadcn/ui configuration? (Recommended)",
        initial: true,
      });

      if (installTailwindResponse.installTailwind) {
        console.log("\n🎨 Installing Tailwind CSS...");
        try {
          // Installation selon la méthode recommandée pour le type de projet
          const installMethod = tailwindDetection.method;

          if (installMethod === "vite-plugin") {
            await installTailwindVitePlugin();
          } else {
            await installTailwindPostCSS(projectType);
          }

          console.log("✅ Tailwind CSS installed successfully!");

          // Re-analyser le projet après installation
          console.log("🔄 Re-analyzing project after Tailwind installation...");
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Mettre à jour les détections
          const newTailwindDetection =
            detectTailwindInstallationMethod(projectType);
          hasTailwind =
            newTailwindDetection.hasVitePlugin ||
            newTailwindDetection.hasTraditionalTailwind;
          hasTailwindConfig = isTailwindConfigured();
          shadcnConfig = detectShadcnConfig();
          componentsDir = findComponentsDir();

          console.log("✅ Project re-analysis completed!");
          console.log(`   Tailwind CSS: ${hasTailwind ? "✅" : "❌"}`);
          console.log(`   Installation Method: ${newTailwindDetection.method}`);
          console.log(
            `   Shadcn Config: ${shadcnConfig.hasConfig ? "✅" : "❌"}`
          );
        } catch (error) {
          console.error("❌ Error installing Tailwind CSS:", error.message);
          console.log(
            "📖 Please install Tailwind manually: https://tailwindcss.com/docs/installation"
          );
          process.exit(1);
        }
      } else {
        console.log(
          "❌ Cannot proceed without Tailwind CSS. Installation cancelled."
        );
        console.log(
          "📖 Please install Tailwind first: https://tailwindcss.com/docs/installation"
        );
        process.exit(0);
      }
    }

    // Vérifier et initialiser Shadcn/ui si nécessaire
    const currentShadcnConfig = detectShadcnConfig();
    if (!currentShadcnConfig.hasConfig) {
      console.log("\n⚠️  Shadcn/ui is not configured.");
      const initShadcnResponse = await prompts({
        type: "confirm",
        name: "initShadcn",
        message: "Would you like to initialize Shadcn/ui configuration?",
        initial: true,
      });

      if (initShadcnResponse.initShadcn) {
        console.log("\n🎨 Initializing Shadcn/ui...");
        try {
          execSync("npx shadcn@latest init", { stdio: "inherit" });
          console.log("✅ Shadcn/ui initialized successfully!");

          // Re-détecter la config shadcn après init
          console.log("🔄 Re-analyzing Shadcn configuration...");
          shadcnConfig = detectShadcnConfig();
          console.log(
            `   Shadcn Config: ${shadcnConfig.hasConfig ? "✅" : "❌"}`
          );
        } catch (error) {
          console.error("❌ Error initializing Shadcn/ui:", error.message);
          console.log(
            "⚠️  You can initialize it manually with: npx shadcn@latest init"
          );
        }
      } else {
        console.log(
          "⚠️  Shadcn/ui not initialized. Component installation may fail."
        );
      }
    }

    // Installer les dépendances manquantes
    await installMissingDependencies();

    /**
     * Questions for final installation
     */
    const questions = [];

    if (shadcnConfig.hasConfig) {
      let componentsPath = defaultTargetDir;
      // Remplacer l'alias @ par src
      if (componentsPath.startsWith("@/")) {
        componentsPath = componentsPath.replace("@/", "src/");
      }
      defaultTargetDir = componentsPath;
    } else if (componentsDir.componentsPath) {
      defaultTargetDir = path.dirname(componentsDir.componentsPath);
      console.log(
        "default components dir from shadcn config:",
        defaultTargetDir
      );
    }

    //for sécurity we verify if defaultType not begin with @, @/
    if (defaultTargetDir === "@" || defaultTargetDir.startsWith("@/")) {
      defaultTargetDir = "src/components";
    }

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
        type: "select",
        name: "overwrite",
        message: "Overwrite existing files?",
        choices: [
          { title: "No, keep existing files", value: false },
          { title: "Yes, overwrite existing files", value: true },
        ],
        initial: 0,
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
      console.log(`   Components directory for shadcn: ${componentsDir}`);
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
          console.log(
            `   Adding components: ${missingComponents.join(", ")}...`
          );
          execSync(`npx shadcn@latest add ${missingComponents.join(" ")}`, {
            stdio: "inherit",
          });
          console.log("✅ Shadcn components installed successfully!");
        } catch (error) {
          console.error(
            "❌ Error installing shadcn components:",
            error.message
          );
          console.log("⚠️  You will need to install them manually:");
          console.log(
            `   npx shadcn@latest add ${missingComponents.join(" ")}`
          );
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

    // Messages de fin
    console.log(
      `\n${colors.green}${colors.bright}${msg.installationComplete}${colors.reset}`
    );
    console.log(`\n${msg.nextSteps}`);
    console.log(`\n${msg.enjoyDeveloping}`);
    // finish script
    process.exit(0);
  } catch (error) {
    console.error(`\n${msg.error}:`, error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

// Function to install missing NPM dependencies
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
    console.log("✅ All required NPM dependencies are already installed");
    return;
  }

  console.log("\n📦 Detected missing NPM dependencies:");
  if (missingDeps.length > 0) {
    console.log(`   Dependencies: ${missingDeps.join(", ")}`);
  }
  if (missingDevDeps.length > 0) {
    console.log(`   DevDependencies: ${missingDevDeps.join(", ")}`);
  }

  const { installDeps } = await prompts({
    type: "select",
    name: "installDeps",
    message: "Do you want to automatically install these dependencies?",
    choices: [
      { title: "Yes, install now", value: true },
      { title: "No, I will install manually", value: false },
    ],
    initial: 0,
  });

  if (!installDeps) {
    console.log(
      "⚠️  Installation cancelled. You will need to install manually:"
    );
    return;
  } else {
    try {
      if (missingDeps.length > 0) {
        console.log("📦 Installing dependencies...");
        execSync(`npm install ${missingDeps.join(" ")}`, { stdio: "inherit" });
      }

      if (missingDevDeps.length > 0) {
        console.log("📦 Installing development dependencies...");
        execSync(`npm install -D ${missingDevDeps.join(" ")}`, {
          stdio: "inherit",
        });
      }

      console.log("✅ All missing dependencies installed successfully!");
    } catch (error) {
      console.error("❌ Error installing dependencies:", error.message);
      console.log("You can install them manually:");
      if (missingDeps.length > 0) {
        console.log(`   npm install ${missingDeps.join(" ")}`);
      }
      if (missingDevDeps.length > 0) {
        console.log(`   npm install -D ${missingDevDeps.join(" ")}`);
      }
    }
  }
}

// Function to download and save files from GitHub
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

/**
 * define if a shadcn component is already installed
 * @param {*} componentName
 * @param {*} uiPath
 * @returns
 */
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

/**
 * We need to find or create a lib directory to place utility functions
 * @param {*} targetDir
 * @returns
 */
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

/**
 * We need to map the file paths from the JSON to the user's project structure
 * @param {*} filePath
 * @param {*} targetDir
 * @param {*} shadcnConfig
 * @param {*} componentsDir
 * @returns
 */
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
      path.join(cleanTargetDir, "ui");

    console.debug("Mapping UI path to:", uiPath);
    return path.join(uiPath, filePath.replace("/components/ui/", ""));
  }

  // Fallback: mettre dans cleanTargetDir
  return path.join(cleanTargetDir, filePath.substring(1));
}

// Run the main function
main().catch((error) => {
  console.error(`\n${msg.error}:`, error);
  process.exit(1);
});
