#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const https = require("https");
const prompts = require("prompts");

// ANSI color codes pour les messages
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

// Messages localisés
const messages = {
  fr: {
    welcome: "🚀 ReactFormMaker - Installation et Configuration",
    projectAnalysis: "🔍 Analyse du projet en cours...",
    projectType: "Type de projet détecté",
    tailwindFound: "Tailwind CSS trouvé",
    tailwindNotFound: "Tailwind CSS non trouvé",
    shadcnFound: "Shadcn/ui configuré",
    shadcnNotFound: "Shadcn/ui non configuré",
    componentsDirFound: "Répertoire des composants",
    installationComplete: "✅ Installation de ReactFormMaker terminée !",
    enjoyDeveloping: "🎉 Bon développement avec ReactFormMaker !",
    nextSteps: "📋 Prochaines étapes :",
    checkDocs: "1. Consultez la documentation dans les fichiers installés",
    configureProject:
      "2. Configurez votre projet avec les composants installés",
    installMissingDeps: "3. Installez les dépendances manquantes si nécessaire",
    error: "❌ Erreur",
  },
  en: {
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
  },
};

// Sélection de la langue (par défaut anglais)
const msg = messages.en;

console.log(`${colors.cyan}${colors.bright}${msg.welcome}${colors.reset}\n`);

// Fonctions utilitaires pour détecter l'environnement du projet

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
        return {
          hasConfig: true,
          configPath,
          config,
        };
      } catch (error) {
        // Configuration invalide, continuer la recherche
      }
    }
  }

  return { hasConfig: false };
}

/**
 * Trouve le répertoire des composants
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

  return { exists: false, path: "src/components" };
}

/**
 * Configure le plugin Vite pour Tailwind CSS
 */
async function configureVitePlugin() {
  console.log("🔧 Configuring Vite plugin...");

  const viteConfigJs = "vite.config.js";
  const viteConfigTs = "vite.config.ts";
  let viteConfigPath = null;

  if (fs.existsSync(viteConfigTs)) {
    viteConfigPath = viteConfigTs;
  } else if (fs.existsSync(viteConfigJs)) {
    viteConfigPath = viteConfigJs;
  }

  if (viteConfigPath) {
    let viteConfig = fs.readFileSync(viteConfigPath, "utf8");

    // Ajouter l'import path si pas présent
    if (
      !viteConfig.includes('import path from "path"') &&
      !viteConfig.includes("import path from 'path'")
    ) {
      viteConfig = viteConfig.replace(
        /import { defineConfig } from ['"]vite['"]/,
        "import path from \"path\"\nimport { defineConfig } from 'vite'"
      );
    }

    // Ajouter l'import tailwindcss si pas présent
    if (!viteConfig.includes("@tailwindcss/vite")) {
      viteConfig = viteConfig.replace(
        /import { defineConfig } from ['"]vite['"]/,
        "import { defineConfig } from 'vite'\nimport tailwindcss from '@tailwindcss/vite'"
      );
    }

    // Ajouter le plugin dans la configuration
    if (!viteConfig.includes("tailwindcss()")) {
      viteConfig = viteConfig.replace(
        /plugins:\s*\[([\s\S]*?)\]/,
        (match, plugins) => {
          const cleanPlugins = plugins.trim();
          if (cleanPlugins) {
            return `plugins: [\n    tailwindcss(),\n${plugins}\n  ]`;
          } else {
            return `plugins: [\n    tailwindcss(),\n  ]`;
          }
        }
      );
    }

    // Ajouter la résolution d'alias si pas présente
    if (!viteConfig.includes("resolve:") && !viteConfig.includes("alias")) {
      viteConfig = viteConfig.replace(
        /plugins:\s*\[[\s\S]*?\],?/,
        (match) => `${match}
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },`
      );
    }

    fs.writeFileSync(viteConfigPath, viteConfig);
    console.log(
      `✅ Updated ${viteConfigPath} with Tailwind CSS plugin and path aliases`
    );
  } else {
    console.log("⚠️  No vite.config found, creating one...");
    const viteConfig = `import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})`;
    fs.writeFileSync("vite.config.ts", viteConfig);
    console.log(
      "✅ Created vite.config.ts with Tailwind CSS plugin and path aliases"
    );
  }
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

    // Détecter l'environnement du projet
    const projectType = detectProjectType();
    const tailwindDetection = detectTailwindInstallationMethod(projectType);
    let hasTailwind = tailwindDetection.hasAnyTailwind;
    let hasTailwindConfig = isTailwindConfigured();
    let shadcnConfig = detectShadcnConfig();
    let componentsDir = findComponentsDir();

    // Afficher l'état du projet
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

    // Créer le répertoire des composants si nécessaire
    const finalComponentsDir = findComponentsDir();
    if (!finalComponentsDir.exists) {
      fs.mkdirSync(finalComponentsDir.path, { recursive: true });
      console.log(
        `✅ Created components directory: ${finalComponentsDir.path}`
      );
    }

    // Installer les composants ReactFormMaker
    await installReactFormMakerComponents(finalComponentsDir.path);

    // Messages de fin
    console.log(
      `\n${colors.green}${colors.bright}${msg.installationComplete}${colors.reset}`
    );
    console.log(`\n${msg.nextSteps}`);
    console.log("1. Install any missing dependencies with:");
    console.log("   npm install class-variance-authority clsx tailwind-merge");
    console.log("2. Configure your project with the installed components");
    console.log("3. Check the documentation in the installed files");
    console.log(`\n${msg.enjoyDeveloping}`);
    // finish script
    process.exit(0);
  } catch (error) {
    console.error(`\n${msg.error}:`, error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

// List of NPM dependencies required for ReactFormMaker
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

// Function to install missing NPM dependencies
async function installMissingDependencies() {
  const missingDeps = [];
  const missingDevDeps = [];

  // Check missing dependencies
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
    console.log("✅ All NPM dependencies are already installed");
    return;
  }

  console.log("\n📦 Installing missing NPM dependencies...");

  if (missingDeps.length > 0) {
    console.log(`Installing dependencies: ${missingDeps.join(", ")}`);
    try {
      execSync(`npm install ${missingDeps.join(" ")}`, {
        stdio: "inherit",
        cwd: process.cwd(),
      });
      console.log("✅ Dependencies installed successfully");
    } catch (error) {
      console.error("❌ Error installing dependencies:", error.message);
      console.log("⚠️  Please install them manually:");
      console.log(`   npm install ${missingDeps.join(" ")}`);
    }
  }

  if (missingDevDeps.length > 0) {
    console.log(`Installing dev dependencies: ${missingDevDeps.join(", ")}`);
    try {
      execSync(`npm install -D ${missingDevDeps.join(" ")}`, {
        stdio: "inherit",
        cwd: process.cwd(),
      });
      console.log("✅ Dev dependencies installed successfully");
    } catch (error) {
      console.error("❌ Error installing dev dependencies:", error.message);
      console.log("⚠️  Please install them manually:");
      console.log(`   npm install -D ${missingDevDeps.join(" ")}`);
    }
  }
}

// Function to download and save files from GitHub
async function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve();
          });
        } else if (response.statusCode === 302 || response.statusCode === 301) {
          // Handle redirects
          https
            .get(response.headers.location, (redirectResponse) => {
              redirectResponse.pipe(file);
              file.on("finish", () => {
                file.close();
                resolve();
              });
            })
            .on("error", reject);
        } else {
          reject(new Error(`Failed to download file: ${response.statusCode}`));
        }
      })
      .on("error", reject);

    file.on("error", reject);
  });
}

// Function to install ReactFormMaker components
async function installReactFormMakerComponents(componentsPath) {
  console.log("\n🎨 Installing ReactFormMaker components...");

  const baseUrl =
    "https://raw.githubusercontent.com/votre-username/react-form-maker/main/frontend/src/components/ReactFormMaker";

  const filesToDownload = [
    {
      url: `${baseUrl}/ReactFormMaker.tsx`,
      path: path.join(componentsPath, "ReactFormMaker", "ReactFormMaker.tsx"),
    },
    {
      url: `${baseUrl}/DOCUMENTATION.md`,
      path: path.join(componentsPath, "ReactFormMaker", "DOCUMENTATION.md"),
    },
    // Vous pouvez ajouter d'autres fichiers ici
  ];

  for (const file of filesToDownload) {
    try {
      // Créer le répertoire si nécessaire
      const dir = path.dirname(file.path);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      console.log(`📥 Downloading: ${path.basename(file.path)}`);
      await downloadFile(file.url, file.path);
      console.log(`✅ Downloaded: ${file.path}`);
    } catch (error) {
      console.error(`❌ Error downloading ${file.path}:`, error.message);
    }
  }

  console.log("✅ ReactFormMaker components installed successfully!");
}

// Run the main function
main().catch((error) => {
  console.error(`\n${msg.error}:`, error);
  process.exit(1);
});
