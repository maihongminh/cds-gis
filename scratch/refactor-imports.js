const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const srcDir = path.join(__dirname, '..', 'src');

walkDir(srcDir, (filePath) => {
  // Ignore components/ui and components/common files themselves to prevent circular dependencies
  const relativePath = path.relative(srcDir, filePath).replace(/\\/g, '/');
  if (relativePath.startsWith('components/ui/') || relativePath.startsWith('components/common/')) {
    return;
  }

  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Regex to match imports from @/components/ui/... or @/components/common/...
  // Group 1: 'ui' or 'common'
  // Group 2: the quote character (' or ")
  const importRegex = /from\s+(['"])@\/components\/(ui|common)\/[^'"]+(['"])/g;

  content = content.replace(importRegex, (match, quote1, type, quote2) => {
    return `from ${quote1}@/components/${type}${quote2}`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Refactored imports in: ${relativePath}`);
  }
});
