const recast = require("recast");
const fs = require("fs");

/**
 * Configure Vite config file to add Tailwind plugin and path alias if missing.
 * - Only adds what is necessary, never overwrites user config.
 * - Uses AST for safe code manipulation.
 */
async function configureVitePlugin() {
  console.log("🔧 Configuring Vite plugin...");

  /** @const {string} Path to vite.config.js */
  const viteConfigJs = "vite.config.js";
  /** @const {string} Path to vite.config.ts */
  const viteConfigTs = "vite.config.ts";
  /** @type {string|null} Actual config file path */
  let viteConfigPath = null;

  // --- Step 1: Find existing config file ---
  if (fs.existsSync(viteConfigTs)) {
    viteConfigPath = viteConfigTs;
  } else if (fs.existsSync(viteConfigJs)) {
    viteConfigPath = viteConfigJs;
  }

  // --- Step 2: Create minimal config if none exists ---
  if (!viteConfigPath) {
    // No config file found, create a minimal vite.config.ts
    const viteConfigContent = `import path from "path"
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
    fs.writeFileSync("vite.config.ts", viteConfigContent);
    console.log(
      "✅ Created vite.config.ts with Tailwind CSS plugin and path aliases",
    );
    return;
  }

  // --- Step 3: Parse config file as AST ---
  /** @const {string} Source code of vite config */
  const viteConfigSource = fs.readFileSync(viteConfigPath, "utf8");
  /** @const {object} AST builders from recast */
  const astBuilders = recast.types.builders;
  /** @const {object} AST of vite config */
  const viteConfigAst = recast.parse(viteConfigSource);

  // --- Step 4: Check and add missing imports ---
  /** @type {boolean} Is 'path' imported? */
  let hasPathImport = false;
  /** @type {boolean} Is 'tailwindcss' imported? */
  let hasTailwindImport = false;
  recast.visit(viteConfigAst, {
    visitImportDeclaration(importDeclarationPath) {
      const importSource = importDeclarationPath.node.source.value;
      if (importSource === "path") hasPathImport = true;
      if (importSource === "@tailwindcss/vite") hasTailwindImport = true;
      this.traverse(importDeclarationPath);
    },
  });
  /** @const {Array} Program body (top-level statements) */
  const programBody = viteConfigAst.program.body;
  // Add missing imports at the top
  if (!hasPathImport) {
    programBody.unshift(
      astBuilders.importDeclaration(
        [astBuilders.importDefaultSpecifier(astBuilders.identifier("path"))],
        astBuilders.literal("path"),
      ),
    );
  }
  if (!hasTailwindImport) {
    programBody.unshift(
      astBuilders.importDeclaration(
        [
          astBuilders.importDefaultSpecifier(
            astBuilders.identifier("tailwindcss"),
          ),
        ],
        astBuilders.literal("@tailwindcss/vite"),
      ),
    );
  }

  // --- Step 5: Add tailwindcss() plugin if missing ---
  recast.visit(viteConfigAst, {
    visitExportDefaultDeclaration(exportDefaultPath) {
      /**
       * @const {object} Vite config object passed to defineConfig
       */
      const viteConfigObject =
        exportDefaultPath.node.declaration.arguments?.[0];
      // Check if plugins array exists
      if (viteConfigObject && viteConfigObject.type === "ObjectExpression") {
        const pluginsProperty = viteConfigObject.properties.find(
          (property) => property.key?.name === "plugins",
        );
        if (
          pluginsProperty &&
          pluginsProperty.value.type === "ArrayExpression"
        ) {
          // Check if tailwindcss() is already present
          const hasTailwindPlugin = pluginsProperty.value.elements.some(
            (element) =>
              element.type === "CallExpression" &&
              element.callee.name === "tailwindcss",
          );
          if (!hasTailwindPlugin) {
            // Add tailwindcss() at the beginning of plugins array
            pluginsProperty.value.elements.unshift(
              astBuilders.callExpression(
                astBuilders.identifier("tailwindcss"),
                [],
              ),
            );
          }
        }
      }
      this.traverse(exportDefaultPath);
    },
  });

  // --- Step 6: Add resolve/alias/@ if missing ---
  recast.visit(viteConfigAst, {
    visitExportDefaultDeclaration(exportDefaultPath) {
      /**
       * @const {object} Vite config object passed to defineConfig
       */
      const viteConfigObject =
        exportDefaultPath.node.declaration.arguments?.[0];
      if (viteConfigObject && viteConfigObject.type === "ObjectExpression") {
        // Check if resolve property exists
        const resolveProperty = viteConfigObject.properties.find(
          (property) => property.key?.name === "resolve",
        );
        if (!resolveProperty) {
          // No resolve property: add full resolve/alias/@ block
          viteConfigObject.properties.push(
            astBuilders.property(
              "init",
              astBuilders.identifier("resolve"),
              astBuilders.objectExpression([
                astBuilders.property(
                  "init",
                  astBuilders.identifier("alias"),
                  astBuilders.objectExpression([
                    astBuilders.property(
                      "init",
                      astBuilders.literal("@"),
                      astBuilders.callExpression(
                        astBuilders.memberExpression(
                          astBuilders.identifier("path"),
                          astBuilders.identifier("resolve"),
                          false,
                        ),
                        [
                          astBuilders.identifier("__dirname"),
                          astBuilders.literal("./src"),
                        ],
                      ),
                    ),
                  ]),
                ),
              ]),
            ),
          );
        } else {
          // resolve exists: check for alias property
          const aliasProperty = resolveProperty.value.properties.find(
            (property) => property.key?.name === "alias",
          );
          if (aliasProperty) {
            // alias exists: check for '@' key
            const hasAliasAt = aliasProperty.value.properties.some(
              (property) => property.key.value === "@",
            );
            if (!hasAliasAt) {
              // Add '@' alias
              aliasProperty.value.properties.push(
                astBuilders.property(
                  "init",
                  astBuilders.literal("@"),
                  astBuilders.callExpression(
                    astBuilders.memberExpression(
                      astBuilders.identifier("path"),
                      astBuilders.identifier("resolve"),
                      false,
                    ),
                    [
                      astBuilders.identifier("__dirname"),
                      astBuilders.literal("./src"),
                    ],
                  ),
                ),
              );
            }
          } else {
            // No alias property: add alias with '@'
            resolveProperty.value.properties.push(
              astBuilders.property(
                "init",
                astBuilders.identifier("alias"),
                astBuilders.objectExpression([
                  astBuilders.property(
                    "init",
                    astBuilders.literal("@"),
                    astBuilders.callExpression(
                      astBuilders.memberExpression(
                        astBuilders.identifier("path"),
                        astBuilders.identifier("resolve"),
                        false,
                      ),
                      [
                        astBuilders.identifier("__dirname"),
                        astBuilders.literal("./src"),
                      ],
                    ),
                  ),
                ]),
              ),
            );
          }
        }
      }
      this.traverse(exportDefaultPath);
    },
  });

  // --- Step 7: Write back the modified config file ---
  const output = recast.print(viteConfigAst).code;
  fs.writeFileSync(viteConfigPath, output);
  console.log(
    `✅ Updated ${viteConfigPath} with Tailwind CSS plugin and path aliases`,
  );
}

module.exports = configureVitePlugin;
