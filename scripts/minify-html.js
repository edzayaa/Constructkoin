// minify-html.js
const fs = require("fs");
const path = require("path");
const htmlnano = require("htmlnano");

(async () => {
  try {
    const src = "index.html";
    const out = path.join("dist", "index.html");

    let html = fs.readFileSync(src, "utf8");

    html = html.replace(
      /(<link[^>]+href=['"])\/*([^'"]+\.css)(['"][^>]*>)/gi,
      (m, p1, p2, p3) => `${p1}${p2}${p3}`
    );

    html = html.replace(
      /(<script[^>]+src=['"])\/*([^'"]+\.js)(['"][^>]*>)/gi,
      (m, p1, p2, p3) => `${p1}${p2}${p3}`
    );

    const { html: minified } = await htmlnano.process(html, {
      collapseWhitespace: "conservative",
      removeComments: true,
      minifyCss: true,
      minifyJs: true,
    });

    fs.mkdirSync("dist", { recursive: true });
    fs.writeFileSync(out, minified, "utf8");
    console.log("✅ HTML minificado ->", out);
  } catch (err) {
    console.error("❌ Error minificando HTML:", err);
    process.exit(1);
  }
})();
