const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Generating favicon files from SVG...');

// Ensure the scripts directory exists
const scriptsDir = path.resolve(__dirname);
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

// Path to the SVG file
const svgPath = path.resolve(__dirname, '../public/cloud-icon.svg');

// Check if the SVG file exists
if (!fs.existsSync(svgPath)) {
  console.error('SVG file not found:', svgPath);
  process.exit(1);
}

// Function to generate favicon files
function generateFavicons() {
  try {
    // Create the public directory if it doesn't exist
    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Instructions for manual favicon generation
    console.log(`
To generate favicon files, you'll need to use an online favicon generator:

1. Upload the SVG file (${svgPath}) to a favicon generator website like:
   - https://realfavicongenerator.net/
   - https://favicon.io/favicon-converter/

2. Download the generated favicon package

3. Extract the files to the 'public' directory of your project

Required files:
- favicon.ico
- favicon-16x16.png
- favicon-32x32.png
- apple-touch-icon.png
- android-chrome-192x192.png
- android-chrome-512x512.png
- site.webmanifest (already created)

Alternatively, you can use the SVG directly in your HTML by adding it to the head section:

<link rel="icon" href="/cloud-icon.svg" type="image/svg+xml">
    `);

  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

// Generate the favicons
generateFavicons(); 