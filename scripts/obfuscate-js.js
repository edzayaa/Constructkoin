// obfuscate-js.js
const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");
const JavaScriptObfuscator = require("javascript-obfuscator");

(async () => {
  const files = await fg(["dist/js/**/*.js"]);

  for (const file of files) {
    const code = fs.readFileSync(file, "utf8");

    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.2,
      disableConsoleOutput: true,
      identifierNamesGenerator: "hexadecimal", // o "mangled"
      numbersToExpressions: true,
      renameGlobals: false, // más seguro con ES Modules
      selfDefending: true,
      simplify: true,
      splitStrings: true,
      splitStringsChunkLength: 6,
      stringArray: true,
      stringArrayEncoding: ["rc4"], // más duro de leer, algo más pesado
      stringArrayThreshold: 0.75,
      transformObjectKeys: true,
      unicodeEscapeSequence: true,
    });

    fs.writeFileSync(file, obfuscated.getObfuscatedCode(), "utf8");
    console.log("🔒 Ofuscado:", file);
  }

  console.log("✅ Ofuscación terminada");
})();
