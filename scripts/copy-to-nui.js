const fs = require('fs');
const path = require('path');

const distRoot = path.join(__dirname, '..', 'dist', 'hacking');
const browserPath = path.join(distRoot, 'browser');
const src = fs.existsSync(browserPath) ? browserPath : distRoot;
const dest = path.join(__dirname, '..', '..', 'nui');

function copyRecursive(srcPath, destPath) {
  const stats = fs.statSync(srcPath);
  if (stats.isDirectory()) {
    if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
    for (const item of fs.readdirSync(srcPath)) {
      copyRecursive(path.join(srcPath, item), path.join(destPath, item));
    }
  } else {
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(srcPath, destPath);
  }
}

if (!fs.existsSync(src)) {
  console.error('Build folder not found:', src);
  process.exit(1);
}

try {
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(dest, { recursive: true });

  // Copy only the contents of 'browser' (if exists) to the root of NUI
  for (const item of fs.readdirSync(src)) {
    copyRecursive(path.join(src, item), path.join(dest, item));
  }

  console.log('Copied build to', dest);
} catch (e) {
  console.error('Error copying to NUI:', e);
  process.exit(1);
}
