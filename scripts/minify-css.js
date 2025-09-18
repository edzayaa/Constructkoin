// minify-css.js
const CleanCSS = require("clean-css");
const fg = require("fast-glob");
const fs = require("fs");
const path = require("path");

(async () => {
  const files = await fg(["css/**/*.css"], { dot: false });

  for (const file of files) {
    const css = fs.readFileSync(file, "utf8");
    const output = new CleanCSS({}).minify(css);

    const outPath = path.join("dist", file);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, output.styles || "", "utf8");
    console.log("✅", outPath);
  }
})();
