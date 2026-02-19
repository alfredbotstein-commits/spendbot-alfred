const puppeteer = require('puppeteer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateAllAssets() {
  console.log('🎨 Generating SpendBot Play Store assets...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  try {
    // 1. Generate Feature Graphic
    console.log('📊 Generating feature graphic...');
    const featurePage = await browser.newPage();
    await featurePage.goto('file://' + path.join(__dirname, 'feature-graphic.html'), {
      waitUntil: 'networkidle0'
    });
    await featurePage.setViewport({ width: 1024, height: 500 });
    
    // Wait for fonts to load
    await featurePage.waitForTimeout(1000);
    
    const featureElement = await featurePage.$('.feature-graphic');
    await featureElement.screenshot({
      path: path.join(__dirname, 'feature-graphic.png'),
      type: 'png'
    });
    await featurePage.close();
    console.log('  ✅ Generated feature-graphic.png');
    
    // 2. Generate Screenshots
    console.log('📱 Generating screenshots...');
    const screenshotPage = await browser.newPage();
    await screenshotPage.goto('file://' + path.join(__dirname, 'screenshot-templates.html'), {
      waitUntil: 'networkidle0'
    });
    await screenshotPage.setViewport({ width: 1080, height: 1920 });
    
    // Wait for fonts to load
    await screenshotPage.waitForTimeout(1000);
    
    const screenshots = await screenshotPage.$$('.screenshot-container');
    
    const screenshotNames = [
      'Hero Dashboard',
      'Category Breakdown', 
      'Add Expense Flow',
      'Monthly Trends',
      'Budget vs Actual',
      'Privacy/Security',
      'Dark Mode',
      'App Overview'
    ];
    
    for (let i = 0; i < screenshots.length; i++) {
      await screenshots[i].screenshot({
        path: path.join(__dirname, `screenshot-${i + 1}.png`),
        type: 'png'
      });
      console.log(`  ✅ Generated screenshot-${i + 1}.png (${screenshotNames[i]})`);
    }
    await screenshotPage.close();
    
  } catch (error) {
    console.error('Error generating assets with Puppeteer:', error);
  } finally {
    await browser.close();
  }
  
  // 3. Generate App Icon from SVG
  console.log('🎯 Generating app icon...');
  try {
    await sharp(path.join(__dirname, 'app-icon.svg'))
      .resize(512, 512)
      .png({ quality: 100, compressionLevel: 0 })
      .toFile(path.join(__dirname, 'app-icon.png'));
    console.log('  ✅ Generated app-icon.png');
  } catch (error) {
    console.error('Error generating app icon:', error);
  }
  
  console.log('\n✨ All assets generated successfully!');
  
  // Verify file sizes and dimensions
  console.log('\n📏 Asset verification:');
  
  const assetSpecs = {
    'feature-graphic.png': { width: 1024, height: 500, maxSizeMB: 1 },
    'screenshot-1.png': { width: 1080, height: 1920, maxSizeMB: 5 },
    'screenshot-2.png': { width: 1080, height: 1920, maxSizeMB: 5 },
    'screenshot-3.png': { width: 1080, height: 1920, maxSizeMB: 5 },
    'screenshot-4.png': { width: 1080, height: 1920, maxSizeMB: 5 },
    'screenshot-5.png': { width: 1080, height: 1920, maxSizeMB: 5 },
    'screenshot-6.png': { width: 1080, height: 1920, maxSizeMB: 5 },
    'screenshot-7.png': { width: 1080, height: 1920, maxSizeMB: 5 },
    'screenshot-8.png': { width: 1080, height: 1920, maxSizeMB: 5 },
    'app-icon.png': { width: 512, height: 512, maxSizeMB: 1 }
  };
  
  let allValid = true;
  
  for (const [filename, specs] of Object.entries(assetSpecs)) {
    const filePath = path.join(__dirname, filename);
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      // Verify dimensions using Sharp
      try {
        const metadata = await sharp(filePath).metadata();
        const dimensionsValid = metadata.width === specs.width && metadata.height === specs.height;
        const sizeValid = stats.size <= specs.maxSizeMB * 1024 * 1024;
        
        const status = (dimensionsValid && sizeValid) ? '✅' : '❌';
        console.log(`  ${status} ${filename}: ${metadata.width}×${metadata.height}px, ${sizeKB}KB`);
        
        if (!dimensionsValid) {
          console.log(`    ⚠️  Expected ${specs.width}×${specs.height}px`);
          allValid = false;
        }
        
        if (!sizeValid) {
          console.log(`    ⚠️  File too large (${sizeMB}MB > ${specs.maxSizeMB}MB limit)`);
          allValid = false;
        }
        
      } catch (error) {
        console.log(`  ❌ ${filename}: Error reading metadata - ${error.message}`);
        allValid = false;
      }
      
    } else {
      console.log(`  ❌ ${filename}: File not found`);
      allValid = false;
    }
  }
  
  console.log('\n' + (allValid ? '🎉 All assets are valid and ready for upload!' : '⚠️  Some assets need attention before upload.'));
  
  // Generate upload checklist
  console.log('\n📋 Google Play Console Upload Checklist:');
  console.log('1. Feature Graphic: Upload feature-graphic.png');
  console.log('2. Screenshots: Upload screenshot-1.png through screenshot-8.png in order');
  console.log('3. App Icon: Upload app-icon.png as high-res icon');
  console.log('4. Verify all assets display correctly in Play Console preview');
  
  return allValid;
}

// Package.json generator function
function generatePackageJson() {
  const packageJson = {
    name: "spendbot-playstore-assets",
    version: "1.0.0",
    description: "Google Play Store asset generator for SpendBot",
    main: "generate-assets.js",
    scripts: {
      "generate": "node generate-assets.js",
      "install-deps": "npm install puppeteer sharp"
    },
    dependencies: {
      "puppeteer": "^21.0.0",
      "sharp": "^0.32.0"
    },
    author: "Loopspur Factory",
    private: true
  };
  
  const packagePath = path.join(__dirname, 'package.json');
  if (!fs.existsSync(packagePath)) {
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('📦 Generated package.json');
  }
}

// Main execution
async function main() {
  try {
    // Generate package.json if it doesn't exist
    generatePackageJson();
    
    // Check if dependencies are installed
    const nodeModulesPath = path.join(__dirname, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      console.log('📦 Dependencies not found. Please run:');
      console.log('   npm install');
      console.log('   Then re-run: node generate-assets.js');
      return;
    }
    
    // Generate all assets
    const success = await generateAllAssets();
    
    if (success) {
      console.log('\n🚀 Assets ready for Google Play Store submission!');
      process.exit(0);
    } else {
      console.log('\n❌ Asset generation completed with errors.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateAllAssets };