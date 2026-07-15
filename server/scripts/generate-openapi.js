// Writes the OpenAPI spec to a static file (server/openapi.json).
//
// Uses the exact same swaggerSpec that /api-docs serves, so the generated file
// never drifts from the live docs. Handy for importing into Postman/Insomnia,
// running codegen, or contract testing.
//
// Usage:  npm run docs:generate   (from the server folder)
const fs = require("fs");
const path = require("path");
const { swaggerSpec } = require("../swagger");

const outPath = path.join(__dirname, "..", "openapi.json");

const pathCount = Object.keys(swaggerSpec.paths || {}).length;

fs.writeFileSync(outPath, JSON.stringify(swaggerSpec, null, 2) + "\n", "utf8");

console.log(`OpenAPI spec written to ${outPath}`);
console.log(`  openapi: ${swaggerSpec.openapi}`);
console.log(`  title:   ${swaggerSpec.info.title} v${swaggerSpec.info.version}`);
console.log(`  paths:   ${pathCount}`);
