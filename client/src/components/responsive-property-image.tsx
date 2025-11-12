interface ImageVariant {
  width: number;
  format: 'jpeg' | 'webp';
  url: string;
  fileSize: number;
}

interface ResponsivePropertyImageProps {
  variants?: ImageVariant[];
  placeholder?: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  fallbackUrl?: string;
  width?: number;
  height?: number;
}

const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

export function ResponsivePropertyImage({
  variants = [],
  placeholder,
  alt,
  className = '',
  loading = 'lazy',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  fallbackUrl,
  width,
  height,
}: ResponsivePropertyImageProps) {
  const webpVariants = variants.filter(v => v.format === 'webp').sort((a, b) => a.width - b.width);
  const jpegVariants = variants.filter(v => v.format === 'jpeg').sort((a, b) => a.width - b.width);
  
  const largestJpeg = jpegVariants[jpegVariants.length - 1];
  const largestWebp = webpVariants[webpVariants.length - 1];
  const largestVariant = largestJpeg || largestWebp;
  
  const finalSrc = largestVariant?.url || fallbackUrl || DEFAULT_PLACEHOLDER;
  
  if (!variants || variants.length === 0) {
    return (
      <img 
        src={finalSrc} 
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        width={width}
        height={height}
      />
    );
  }
  
  const webpSrcSet = webpVariants.length > 0 ? webpVariants.map(v => `${v.url} ${v.width}w`).join(', ') : null;
  const jpegSrcSet = jpegVariants.length > 0 ? jpegVariants.map(v => `${v.url} ${v.width}w`).join(', ') : null;
  
  return (
    <div className="relative overflow-hidden" style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}>
      {placeholder && (
        <div 
          className="absolute inset-0 blur-sm"
          style={{
            backgroundImage: `url(${placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        />
      )}
      <picture>
        {webpSrcSet && (
          <source 
            type="image/webp"
            srcSet={webpSrcSet}
            sizes={sizes}
          />
        )}
        {jpegSrcSet && (
          <source 
            type="image/jpeg"
            srcSet={jpegSrcSet}
            sizes={sizes}
          />
        )}
        <img 
          src={finalSrc}
          alt={alt}
          className={className}
          loading={loading}
          decoding="async"
          width={width}
          height={height}
        />
      </picture>
    </div>
  );
}
