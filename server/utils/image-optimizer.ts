import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

export interface ImageVariant {
  width: number;
  format: 'jpeg' | 'webp';
  url: string;
  fileSize: number;
}

export interface OptimizedImageResult {
  variants: ImageVariant[];
  placeholder: string;
  originalFilename: string;
}

const VARIANT_WIDTHS = [480, 960, 1600];
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 75;
const PLACEHOLDER_WIDTH = 20;

export async function optimizePropertyImage(
  inputBuffer: Buffer,
  originalFilename: string
): Promise<OptimizedImageResult> {
  const baseId = randomUUID();
  const uploadDir = 'public/uploads';
  
  await fs.mkdir(uploadDir, { recursive: true });
  
  const metadata = await sharp(inputBuffer).metadata();
  const originalWidth = metadata.width || 1600;
  
  const variants: ImageVariant[] = [];
  
  for (const targetWidth of VARIANT_WIDTHS) {
    if (targetWidth > originalWidth) {
      continue;
    }
    
    const jpegFilename = `${baseId}-${targetWidth}w.jpg`;
    const webpFilename = `${baseId}-${targetWidth}w.webp`;
    const jpegPath = path.join(uploadDir, jpegFilename);
    const webpPath = path.join(uploadDir, webpFilename);
    
    const resizedImage = sharp(inputBuffer)
      .resize(targetWidth, null, {
        fit: 'cover',
        withoutEnlargement: true,
      });
    
    const [jpegInfo, webpInfo] = await Promise.all([
      resizedImage
        .clone()
        .jpeg({ quality: JPEG_QUALITY, progressive: true })
        .toFile(jpegPath),
      resizedImage
        .clone()
        .webp({ quality: WEBP_QUALITY })
        .toFile(webpPath),
    ]);
    
    variants.push(
      {
        width: targetWidth,
        format: 'jpeg',
        url: `/uploads/${jpegFilename}`,
        fileSize: jpegInfo.size,
      },
      {
        width: targetWidth,
        format: 'webp',
        url: `/uploads/${webpFilename}`,
        fileSize: webpInfo.size,
      }
    );
  }
  
  const placeholderBuffer = await sharp(inputBuffer)
    .resize(PLACEHOLDER_WIDTH, null, {
      fit: 'cover',
    })
    .jpeg({ quality: 60 })
    .toBuffer();
  
  const placeholder = `data:image/jpeg;base64,${placeholderBuffer.toString('base64')}`;
  
  return {
    variants,
    placeholder,
    originalFilename,
  };
}

export function getImageSrcSet(variants: ImageVariant[], format: 'jpeg' | 'webp'): string {
  return variants
    .filter(v => v.format === format)
    .sort((a, b) => a.width - b.width)
    .map(v => `${v.url} ${v.width}w`)
    .join(', ');
}

export function getMainImageUrl(variants: ImageVariant[]): string {
  const jpegVariants = variants.filter(v => v.format === 'jpeg');
  const largest = jpegVariants.sort((a, b) => b.width - a.width)[0];
  return largest?.url || '';
}
