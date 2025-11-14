// Module d'installation et configuration de Tailwind CSS
const fs = require("fs");
const { execSync } = require("child_process");

function isTailwindInstalled() {
  try {
    const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));
    return !!(
      packageJson.dependencies?.["tailwindcss"] ||
      packageJson.devDependencies?.["tailwindcss"]
    );
  } catch {
    return false;
  }
}

function isTailwindConfigured() {
  return [
    "tailwind.config.js",
    "tailwind.config.ts",
    "tailwind.config.mjs",
  ].some((file) => fs.existsSync(file));
}

function installTailwindInteractive() {
  if (isTailwindInstalled()) {
    console.log("✅ Tailwind CSS is already installed.");
    return;
  }
  console.log("📦 Installing Tailwind CSS...");
  try {
    execSync("npm install -D tailwindcss postcss autoprefixer", {
      stdio: "inherit",
    });
    execSync("npx tailwindcss init -p", { stdio: "inherit" });
    console.log("✅ Tailwind CSS installed and configured!");
  } catch (error) {
    console.error("❌ Error installing Tailwind CSS:", error.message);
    console.log(
      "📖 Please install Tailwind manually: https://tailwindcss.com/docs/installation",
    );
  }
}

module.exports = {
  isTailwindInstalled,
  isTailwindConfigured,
  installTailwindInteractive,
};
