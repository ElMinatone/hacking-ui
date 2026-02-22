const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '../dist/hacking');

// Find all HTML files in the dist folder
function findHtmlFiles(dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    console.log('Dist folder not found:', dir);
    return files;
  }
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Uncomment HTML content for FiveM compatibility
function processHtmlFiles(htmlFiles) {
  for (const filePath of htmlFiles) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Uncomment FiveM-specific code that might be commented out
      content = content.replace(/<!--\s*<script/g, '<script');
      content = content.replace(/<\/script>\s*-->/g, '</script>');
      content = content.replace(/<!--\s*<link/g, '<link');
      content = content.replace(/\/>\s*-->/g, '/>');
      
      fs.writeFileSync(filePath, content);
      console.log('Processed:', filePath);
    } catch (error) {
      console.error('Error processing file:', filePath, error);
    }
  }
}

const htmlFiles = findHtmlFiles(distPath);
processHtmlFiles(htmlFiles);

console.log('HTML uncomment script completed!');
