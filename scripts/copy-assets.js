const fs = require("fs");
const path = require("path");

const itemsToCopy = [
    "assets",
    "robots.txt",
    "site.webmanifest",
    "favicon.ico",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "android-chrome-192x192.png",
    "android-chrome-512x512.png",
    "apple-touch-icon.png"
  ];

function copyRecursive(src, dest) {
  if (fs.existsSync(src)) {
    const stats = fs.statSync(src);

    if (stats.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      for (const file of fs.readdirSync(src)) {
        copyRecursive(path.join(src, file), path.join(dest, file));
      }
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

for (const item of itemsToCopy) {
  if (fs.existsSync(item)) {
    const dest = path.join("dist", item);
    copyRecursive(item, dest);
    console.log(`✅ Copiado -> ${dest}`);
  }
}
