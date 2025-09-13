import * as FileSystem from 'expo-file-system/legacy';

export interface ImageSaveOptions {
  format?: 'jpeg' | 'png';
  filename?: string;
  directory?: string;
}

export interface ImageInfo {
  uri: string;
  width?: number;
  height?: number;
  size?: number;
}

/**
 * ImageService - Handles saving and managing images in the app's filesystem
 */
export class ImageService {
  // Directory for storing item images
  private static readonly ITEMS_IMAGES_DIR = `${FileSystem.documentDirectory}images/items/`;
  private static readonly DOCUMENTS_IMAGES_DIR = `${FileSystem.documentDirectory}images/documents/`;

  /**
   * Initialize the image directories
   */
  static async initializeDirectories(): Promise<void> {
    try {
      // Create items images directory
      const itemsDirInfo = await FileSystem.getInfoAsync(this.ITEMS_IMAGES_DIR);
      if (!itemsDirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.ITEMS_IMAGES_DIR, { intermediates: true });
      }

      // Create documents images directory
      const docsDirInfo = await FileSystem.getInfoAsync(this.DOCUMENTS_IMAGES_DIR);
      if (!docsDirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.DOCUMENTS_IMAGES_DIR, { intermediates: true });
      }
    } catch (error) {
      console.error('Error initializing image directories:', error);
      throw new Error(`Failed to initialize image directories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Save an item image to the filesystem
   * @param imageUri The URI of the image to save
   * @param itemId Optional item ID for naming
   * @param options Save options
   * @returns Promise<string> The new file URI
   */
  static async saveItemImage(
    imageUri: string,
    itemId?: string,
    options: ImageSaveOptions = {}
  ): Promise<string> {
    try {
      await this.initializeDirectories();

      const {
        format = 'jpeg',
        filename,
      } = options;

      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const extension = format === 'jpeg' ? 'jpg' : format;

      const finalFilename = filename ||
        (itemId ? `item-${itemId}-${timestamp}.${extension}` : `item-${randomId}-${timestamp}.${extension}`);

      const targetPath = `${this.ITEMS_IMAGES_DIR}${finalFilename}`;

      // Copy the image to the target location
      await FileSystem.copyAsync({
        from: imageUri,
        to: targetPath,
      });

      return targetPath;
    } catch (error) {
      console.error('Error saving item image:', error);
      throw new Error(`Failed to save item image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Save a document image to the filesystem
   * @param imageUri The URI of the image to save
   * @param documentId Optional document ID for naming
   * @param options Save options
   * @returns Promise<string> The new file URI
   */
  static async saveDocumentImage(
    imageUri: string,
    documentId?: string,
    options: ImageSaveOptions = {}
  ): Promise<string> {
    try {
      await this.initializeDirectories();

      const {
        format = 'jpeg',
        filename,
      } = options;

      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const extension = format === 'jpeg' ? 'jpg' : format;

      const finalFilename = filename ||
        (documentId ? `doc-${documentId}-${timestamp}.${extension}` : `doc-${randomId}-${timestamp}.${extension}`);

      const targetPath = `${this.DOCUMENTS_IMAGES_DIR}${finalFilename}`;

      // Copy the image to the target location
      await FileSystem.copyAsync({
        from: imageUri,
        to: targetPath,
      });

      return targetPath;
    } catch (error) {
      console.error('Error saving document image:', error);
      throw new Error(`Failed to save document image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get image information
   * @param imageUri The URI of the image
   * @returns Promise<ImageInfo>
   */
  static async getImageInfo(imageUri: string): Promise<ImageInfo> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);

      return {
        uri: imageUri,
        size: fileInfo.exists ? (fileInfo as any).size : undefined,
        // Note: Getting image dimensions would require additional libraries like expo-image-manipulator
        // For now, we'll just return the URI and size
      };
    } catch (error) {
      console.error('Error getting image info:', error);
      throw new Error(`Failed to get image info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete an image file
   * @param imageUri The URI of the image to delete
   * @returns Promise<void>
   */
  static async deleteImage(imageUri: string): Promise<void> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(imageUri);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if an image URI is a local file URI (starts with file://)
   * @param uri The URI to check
   * @returns boolean
   */
  static isLocalFileUri(uri: string): boolean {
    return uri.startsWith('file://') || uri.startsWith(FileSystem.documentDirectory || '');
  }

  /**
   * Check if an image file exists
   * @param imageUri The URI of the image
   * @returns Promise<boolean>
   */
  static async imageExists(imageUri: string): Promise<boolean> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      return fileInfo.exists;
    } catch {
      return false;
    }
  }

  /**
   * List all item images
   * @returns Promise<string[]>
   */
  static async listItemImages(): Promise<string[]> {
    try {
      await this.initializeDirectories();

      const files = await FileSystem.readDirectoryAsync(this.ITEMS_IMAGES_DIR);
      return files
        .filter(file => file.toLowerCase().match(/\.(jpg|jpeg|png)$/))
        .map(file => `${this.ITEMS_IMAGES_DIR}${file}`);
    } catch (error) {
      console.error('Error listing item images:', error);
      return [];
    }
  }

  /**
   * List all document images
   * @returns Promise<string[]>
   */
  static async listDocumentImages(): Promise<string[]> {
    try {
      await this.initializeDirectories();

      const files = await FileSystem.readDirectoryAsync(this.DOCUMENTS_IMAGES_DIR);
      return files
        .filter(file => file.toLowerCase().match(/\.(jpg|jpeg|png)$/))
        .map(file => `${this.DOCUMENTS_IMAGES_DIR}${file}`);
    } catch (error) {
      console.error('Error listing document images:', error);
      return [];
    }
  }

  /**
   * Clean up orphaned images (images that don't belong to any existing items or documents)
   * This is a utility function for maintenance
   * @param existingItemIds Array of existing item IDs
   * @param existingDocumentIds Array of existing document IDs
   * @returns Promise<number> Number of images deleted
   */
  static async cleanupOrphanedImages(
    existingItemIds: string[] = [],
    existingDocumentIds: string[] = []
  ): Promise<number> {
    try {
      let deletedCount = 0;

      // Clean item images
      const itemImages = await this.listItemImages();
      for (const imagePath of itemImages) {
        const filename = imagePath.split('/').pop() || '';
        const hasValidItemId = existingItemIds.some(id => filename.includes(`item-${id}-`));

        if (!hasValidItemId) {
          await this.deleteImage(imagePath);
          deletedCount++;
        }
      }

      // Clean document images
      const docImages = await this.listDocumentImages();
      for (const imagePath of docImages) {
        const filename = imagePath.split('/').pop() || '';
        const hasValidDocId = existingDocumentIds.some(id => filename.includes(`doc-${id}-`));

        if (!hasValidDocId) {
          await this.deleteImage(imagePath);
          deletedCount++;
        }
      }

      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up orphaned images:', error);
      throw new Error(`Failed to cleanup orphaned images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
