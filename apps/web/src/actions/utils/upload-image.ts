import { v4 as uuidv4 } from 'uuid';
export async function uploadImage(file: File): Promise<string> {
  if (!file) {
    return '';
  }

  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    const fileUrl = `https://storage.example.com/albums/${fileName}`;

    return fileUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to process image upload');
  }
}
