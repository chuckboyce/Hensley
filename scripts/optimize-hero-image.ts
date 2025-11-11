import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

async function optimizeHeroImage() {
  const inputPath = path.join(process.cwd(), 'public', 'hero-original.jpg');
  const outputDir = path.join(process.cwd(), 'public');

  console.log('Starting hero image optimization...');

  // Define responsive sizes
  const sizes = [
    { width: 640, suffix: 'mobile' },   // Mobile
    { width: 1024, suffix: 'tablet' },  // Tablet
    { width: 1920, suffix: 'desktop' }, // Desktop
    { width: 2560, suffix: '2x' }       // Retina/4K
  ];

  try {
    const imageBuffer = await fs.readFile(inputPath);

    for (const size of sizes) {
      console.log(`Generating ${size.suffix} (${size.width}px) versions...`);

      // Generate WebP
      await sharp(imageBuffer)
        .resize(size.width, null, { 
          withoutEnlargement: true,
          fit: 'cover' 
        })
        .webp({ quality: 85 })
        .toFile(path.join(outputDir, `hero-${size.suffix}.webp`));
      console.log(`  ✓ WebP created`);

      // Generate AVIF (better compression than WebP)
      await sharp(imageBuffer)
        .resize(size.width, null, { 
          withoutEnlargement: true,
          fit: 'cover' 
        })
        .avif({ quality: 75 })
        .toFile(path.join(outputDir, `hero-${size.suffix}.avif`));
      console.log(`  ✓ AVIF created`);

      // Generate optimized JPEG fallback
      await sharp(imageBuffer)
        .resize(size.width, null, { 
          withoutEnlargement: true,
          fit: 'cover' 
        })
        .jpeg({ quality: 85, progressive: true })
        .toFile(path.join(outputDir, `hero-${size.suffix}.jpg`));
      console.log(`  ✓ JPEG created`);
    }

    console.log('\n✨ All images optimized successfully!');
    console.log('\nGenerated files:');
    
    const files = await fs.readdir(outputDir);
    const heroFiles = files.filter(f => f.startsWith('hero-') && !f.includes('original'));
    
    for (const file of heroFiles.sort()) {
      const stats = await fs.stat(path.join(outputDir, file));
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`  ${file}: ${sizeKB}KB`);
    }

  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

optimizeHeroImage();
