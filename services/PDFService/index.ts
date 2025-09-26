import 'react-native-get-random-values'; // Required for pdf-lib
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { PDFDocument } from 'pdf-lib';

export interface PDFCreationOptions {
  title?: string;
  author?: string;
  subject?: string;
  compress?: boolean;
  pageMargin?: number;
  imageQuality?: number;
  useTimestamp?: boolean; // Whether to use timestamp in filename
}

export interface ImageInfo {
  uri: string;
  width?: number;
  height?: number;
}

/**
 * Create a PDF document from an array of image URIs
 * @param imageUris Array of image URIs to convert to PDF
 * @param options Optional PDF creation settings
 * @returns Promise<string> The file path of the created PDF
 */
export const createPdfFromImages = async (
  imageUris: string[],
  options: PDFCreationOptions = {}
): Promise<string> => {
  if (!imageUris || imageUris.length === 0) {
    throw new Error('No images provided for PDF creation');
  }

  const {
    title = 'Scanned Document',
    author = 'GarantEasy Scanner',
    subject = 'Scanned Document',
    compress = true,
    pageMargin = 20,
    useTimestamp = false,
  } = options;

  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Set document metadata
    pdfDoc.setTitle(title);
    pdfDoc.setAuthor(author);
    pdfDoc.setSubject(subject);
    pdfDoc.setCreator('GaranteAsy PDF Service');
    pdfDoc.setProducer('pdf-lib');
    pdfDoc.setCreationDate(new Date());
    pdfDoc.setModificationDate(new Date());

    // Process each image
    for (let i = 0; i < imageUris.length; i++) {
      const imageUri = imageUris[i];

      try {
        // Read the image file
        const imageBytes = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Convert base64 to bytes
        const imageData = `data:image/jpeg;base64,${imageBytes}`;

        // Embed the image in the PDF
        let image;
        if (imageUri.toLowerCase().includes('.png')) {
          image = await pdfDoc.embedPng(imageData);
        } else {
          // Default to JPEG for most scanned documents
          image = await pdfDoc.embedJpg(imageData);
        }

        // Get image dimensions
        const { width: imgWidth, height: imgHeight } = image;

        // Create a new page with appropriate size
        // Calculate page size based on image aspect ratio (A4 size as default)
        const maxWidth = 595; // A4 width in points
        const maxHeight = 842; // A4 height in points

        let pageWidth = maxWidth;
        let pageHeight = maxHeight;

        // Calculate scaling to fit image on page while maintaining aspect ratio
        const aspectRatio = imgWidth / imgHeight;

        if (aspectRatio > 1) {
          // Landscape orientation
          pageHeight = pageWidth / aspectRatio;
          if (pageHeight > maxHeight) {
            pageHeight = maxHeight;
            pageWidth = pageHeight * aspectRatio;
          }
        } else {
          // Portrait orientation
          pageWidth = pageHeight * aspectRatio;
          if (pageWidth > maxWidth) {
            pageWidth = maxWidth;
            pageHeight = pageWidth / aspectRatio;
          }
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Calculate image size and position on page
        const availableWidth = pageWidth - (pageMargin * 2);
        const availableHeight = pageHeight - (pageMargin * 2);

        let finalWidth = availableWidth;
        let finalHeight = availableHeight;

        // Maintain aspect ratio while fitting within available space
        if (aspectRatio > availableWidth / availableHeight) {
          finalHeight = finalWidth / aspectRatio;
        } else {
          finalWidth = finalHeight * aspectRatio;
        }

        // Center the image on the page
        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;

        // Draw the image on the page
        page.drawImage(image, {
          x,
          y,
          width: finalWidth,
          height: finalHeight,
        });

      } catch (imageError) {
        console.error(`Error processing image ${i + 1}:`, imageError);
        // Continue with other images even if one fails
        continue;
      }
    }

    // Serialize the PDF document
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: compress,
    });

    // Generate unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = title ? `${title}${useTimestamp ? ('-' + timestamp) : ''}.pdf` : `scanned-document-${timestamp}.pdf`;
    const filePath = `${FileSystem.documentDirectory}${filename}`;

    // Write PDF to file system
    // Convert Uint8Array to base64 string using Buffer polyfill
    const base64String = Buffer.from(pdfBytes).toString('base64');
    await FileSystem.writeAsStringAsync(
      filePath,
      base64String,
      { encoding: FileSystem.EncodingType.Base64 }
    );

    return filePath;

  } catch (error) {
    console.error('Error creating PDF:', error);
    throw new Error(`Failed to create PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Create a PDF and immediately share it
 * @param imageUris Array of image URIs to convert to PDF
 * @param options Optional PDF creation settings
 * @returns Promise<void>
 */
export const createAndSharePdf = async (
  imageUris: string[],
  options: PDFCreationOptions = {}
): Promise<void> => {
  try {
    const pdfPath = await createPdfFromImages(imageUris, options);

    // Check if sharing is available
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfPath, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Scanned Document',
      });
    } else {
      throw new Error('Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Error creating and sharing PDF:', error);
    throw error;
  }
};

/**
 * Get file info for a PDF file
 * @param filePath Path to the PDF file
 * @returns Promise<FileSystem.FileInfo>
 */
export const getPdfInfo = async (filePath: string): Promise<FileSystem.FileInfo> => {
  try {
    return await FileSystem.getInfoAsync(filePath);
  } catch (error) {
    console.error('Error getting PDF info:', error);
    throw new Error(`Failed to get PDF info: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete a PDF file
 * @param filePath Path to the PDF file to delete
 * @returns Promise<void>
 */
export const deletePdf = async (filePath: string): Promise<void> => {
  try {
    await FileSystem.deleteAsync(filePath);
  } catch (error) {
    console.error('Error deleting PDF:', error);
    throw new Error(`Failed to delete PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * List all PDF files in the documents directory
 * @returns Promise<string[]> Array of PDF file paths
 */
export const listPdfFiles = async (): Promise<string[]> => {
  try {
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory || '');
    return files
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .map(file => `${FileSystem.documentDirectory}${file}`);
  } catch (error) {
    console.error('Error listing PDF files:', error);
    throw new Error(`Failed to list PDF files: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const removeFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return filename; // No extension found
  return filename.substring(0, lastDotIndex);
};