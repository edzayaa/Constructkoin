const { minify } = require("terser");
const fg = require("fast-glob");
const fs = require("fs");
const path = require("path");

(async () => {
  const files = await fg(["js/**/*.js"]);

  for (const file of files) {
    const code = fs.readFileSync(file, "utf8");
    const result = await minify(code, { compress: true, mangle: true });

    // en dist/, mismo nombre sin .min
    const outPath = path.join("dist", file);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, result.code, "utf8");

    console.log("✅ " + outPath);
  }
})();
