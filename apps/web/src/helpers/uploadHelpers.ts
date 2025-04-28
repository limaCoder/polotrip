import exifr from 'exifr';
import imageCompression from 'browser-image-compression';

/**
 * Extract EXIF metadata from an image
 */
export async function extractExifData(file: File): Promise<{
  dateTaken: string | null;
  latitude: number | null;
  longitude: number | null;
  width: number | null;
  height: number | null;
}> {
  if (!file || !file.type.startsWith('image/')) {
    return {
      dateTaken: null,
      latitude: null,
      longitude: null,
      width: null,
      height: null,
    };
  }

  try {
    const exif = await exifr.parse(file, {
      gps: true,
      exif: true,
    });

    if (!exif) {
      return {
        dateTaken: null,
        latitude: null,
        longitude: null,
        width: null,
        height: null,
      };
    }

    let dateTaken = null;
    if (exif.DateTimeOriginal) {
      try {
        dateTaken = new Date(exif.DateTimeOriginal).toISOString();
      } catch (err) {
        console.error('Error converting date:', err);
      }
    }

    const latitude = typeof exif.latitude === 'number' ? exif.latitude : null;
    const longitude = typeof exif.longitude === 'number' ? exif.longitude : null;

    let width = null;
    let height = null;

    if (exif?.ExifImageWidth && exif?.ExifImageHeight) {
      width = exif.ExifImageWidth;
      height = exif.ExifImageHeight;
    } else {
      try {
        const imageBitmap = await createImageBitmap(file);
        width = imageBitmap.width;
        height = imageBitmap.height;
      } catch (e) {
        console.error('Error getting image dimensions:', e);
      }
    }

    return {
      dateTaken,
      latitude,
      longitude,
      width,
      height,
    };
  } catch (error) {
    console.error('Error extracting EXIF metadata:', error);
    return {
      dateTaken: null,
      latitude: null,
      longitude: null,
      width: null,
      height: null,
    };
  }
}

/**
 * Compress an image while preserving EXIF data
 */
export async function compressImage(
  file: File,
  options?: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    quality?: number;
  },
): Promise<File> {
  try {
    const compressionOptions = {
      maxSizeMB: options?.maxSizeMB ?? 1,
      maxWidthOrHeight: options?.maxWidthOrHeight ?? 1920,
      useWebWorker: true,
      fileType: file?.type,
      quality: options?.quality ?? 0.6,
      preserveExif: true,
      alwaysKeepResolution: false,
      initialQuality: options?.quality ?? 0.6,
    };

    const fileName = file.name;
    const lastModified = file.lastModified;

    const compressedImage = await imageCompression(file, compressionOptions);

    const fixedCompressedFile = new File([compressedImage], fileName, {
      type: compressedImage.type,
      lastModified: lastModified,
    });

    return fixedCompressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
}

/**
 * Format the file size for display
 */
export function formatFileSize(bytes?: number): string {
  if (bytes === undefined || bytes === null || isNaN(bytes) || bytes < 0) {
    return '0.0 MB';
  }

  if (bytes === 0) return '0.0 MB';

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Generate a unique ID for use in uploads
 */
export function generateUniqueId(): string {
  try {
    return crypto.randomUUID();
  } catch (error) {
    console.error('Error generating unique ID. Applying fallback:', error);
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }
}

/**
 * Create a preview URL for a file
 */
export function createPreviewUrl(file?: File): string {
  if (!file) {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23ddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24px" fill="%23555">Sem Preview</text></svg>';
  }

  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Error creating preview:', error);
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23ddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24px" fill="%23555">Erro</text></svg>';
  }
}

/**
 * Revoke a preview URL to free memory
 */
export function revokePreviewUrl(previewUrl?: string): void {
  if (!previewUrl || previewUrl.startsWith('data:')) return;

  try {
    URL.revokeObjectURL(previewUrl);
  } catch (error) {
    console.error('Error revoking preview URL:', error);
  }
}
