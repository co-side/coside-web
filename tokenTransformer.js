// tokenTransformer.js
import { writeFile, readFile, mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function resolveReference(value, tokens) {
  if (typeof value !== "string" || !value.startsWith("{")) {
    return value;
  }

  let resolvedValue = value; // Start with the original value

  // Keep resolving until there are no more references in the value
  while (typeof resolvedValue === "string" && resolvedValue.startsWith("{")) {
    const path = resolvedValue.slice(1, -1).split(".");
    let current;

    if (tokens[path[0]]) {
      current = tokens[path[0]];
      path.shift();
    } else {
      current = tokens.global_tokens; // Default to global if collection not specified
    }

    for (const key of path) {
      if (!current || !current[key]) {
        return value; // Return original value if reference not found
      }
      current = current[key];
    }
    resolvedValue = current.value; // Update resolvedValue for the next iteration
  }

  return resolvedValue;
}

function transformTokens(tokens) {
  const transformed = {};

  function processTokenSet(tokenSet, target) {
    for (const [key, value] of Object.entries(tokenSet)) {
      if ("value" in value) {
        let resolvedValue = value.value;
        if (
          typeof resolvedValue === "string" &&
          resolvedValue.startsWith("{")
        ) {
          resolvedValue = resolveReference(resolvedValue, tokens);
        }

        if (value.type === "number") {
          target[key] = `${resolvedValue}px`;
        } else {
          target[key] = resolvedValue;
        }
      } else {
        target[key] = {};
        processTokenSet(value, target[key]);
      }
    }
  }

  // Directly process global_tokens and component_tokens children
  processTokenSet(tokens.global_tokens, transformed);
  processTokenSet(tokens.component_tokens, transformed);

  return transformed;
}

// ... (rest of the code remains the same)

function generateThemeFile(transformedTokens) {
  return `// This file is auto-generated from Figma tokens. Do not edit directly.
export const theme = ${JSON.stringify(transformedTokens, null, 2)} as const;

export type Theme = typeof theme;
`;
}

// Main function
async function main() {
  try {
    // Read tokens from JSON file
    const tokensPath = join(process.cwd(), "designTokens.json");
    const figmaTokens = JSON.parse(await readFile(tokensPath, "utf8"));

    // Transform tokens
    const transformedTokens = transformTokens(figmaTokens);

    // Generate theme file content
    const themeFileContent = generateThemeFile(transformedTokens);

    // Write to theme.ts
    const outputPath = join(process.cwd(), "src", "styles", "figmaTheme.ts");

    // Ensure the directory exists
    const dir = dirname(outputPath);
    try {
      await mkdir(dir, { recursive: true });
    } catch (err) {
      if (err.code !== "EEXIST") throw err;
    }

    await writeFile(outputPath, themeFileContent);

    console.log("Theme file generated successfully!");
  } catch (error) {
    console.error("Error generating theme file:", error);
    console.error("Error details:", error.message);
    process.exit(1);
  }
}

// Run the transformer
main();
