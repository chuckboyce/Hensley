import { optimizePropertyImage } from "../server/utils/image-optimizer";
import fs from "fs/promises";
import path from "path";

async function optimizeExistingImages() {
  const uploadsDir = "public/uploads";
  
  try {
    const files = await fs.readdir(uploadsDir);
    
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });
    
    const originalImages = imageFiles.filter(file => {
      return !file.match(/-\d+w\.(jpg|webp)$/);
    });
    
    console.log(`Found ${originalImages.length} original images to optimize`);
    
    for (const file of originalImages) {
      const filePath = path.join(uploadsDir, file);
      console.log(`\nOptimizing: ${file}`);
      
      try {
        const fileStats = await fs.stat(filePath);
        console.log(`  Original size: ${(fileStats.size / 1024).toFixed(2)} KB`);
        
        const buffer = await fs.readFile(filePath);
        
        const result = await optimizePropertyImage(buffer, file);
        
        console.log(`  Generated ${result.variants.length} variants:`);
        
        const totalSize = result.variants.reduce((sum, v) => sum + v.fileSize, 0);
        console.log(`  Total optimized size: ${(totalSize / 1024).toFixed(2)} KB`);
        console.log(`  Reduction: ${(((fileStats.size - totalSize) / fileStats.size) * 100).toFixed(1)}%`);
        
        result.variants.forEach(v => {
          console.log(`    - ${v.width}w ${v.format.toUpperCase()}: ${(v.fileSize / 1024).toFixed(2)} KB`);
        });
        
      } catch (error) {
        console.error(`  Error optimizing ${file}:`, error);
      }
    }
    
    console.log('\n✅ Optimization complete!');
    
  } catch (error) {
    console.error('Error reading uploads directory:', error);
    process.exit(1);
  }
}

optimizeExistingImages();
