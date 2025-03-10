import ExifReader from 'exif-reader';
import { convertDMSToDD } from './convertDMSToDD';

async function extractExifData(buffer: Buffer) {
  try {
    const exifMarker = buffer.indexOf(Buffer.from([0xff, 0xe1]));
    if (exifMarker === -1) return null;

    const exifData = ExifReader(buffer.slice(exifMarker + 4));

    const photoDateTimeOriginal = exifData?.Photo?.DateTimeOriginal;

    const photoGPSLatitude = exifData?.GPSInfo?.GPSLatitude;
    const photoGPSLatitudeRef = exifData?.GPSInfo?.GPSLatitudeRef;

    const photoGPSLongitude = exifData?.GPSInfo?.GPSLongitude;
    const photoGPSLongitudeRef = exifData?.GPSInfo?.GPSLongitudeRef;

    return {
      dateTaken: photoDateTimeOriginal ? new Date(photoDateTimeOriginal) : null,
      latitude: photoGPSLatitude ? convertDMSToDD(photoGPSLatitude, photoGPSLatitudeRef) : null,
      longitude: photoGPSLongitude ? convertDMSToDD(photoGPSLongitude, photoGPSLongitudeRef) : null,
    };
  } catch (error) {
    console.error('Error when extracting EXIF metadata:', error);

    return null;
  }
}

export { extractExifData };
