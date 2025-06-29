/**
 * Example usage of the PDF Service
 *
 * This file demonstrates how to use the PDF service to create PDFs from scanned documents.
 * Copy the relevant code to your actual implementation.
 */

import { CameraCapturedPicture } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { createPdfFromImages, createAndSharePdf, PDFCreationOptions } from './index';

/**
 * Example 1: Basic PDF creation from scanned images
 */
export async function createPdfFromScannedDocuments(
  scannedImages: (CameraCapturedPicture | ImagePicker.ImagePickerAsset)[],
  documentType: 'invoice' | 'ticket' = 'invoice'
): Promise<string> {
  try {
    // Extract image URIs from scanned data
    const imageUris = scannedImages.map(image => image.uri);

    // Configure PDF options based on document type
    const pdfOptions: PDFCreationOptions = {
      title: documentType === 'invoice' ? 'Invoice Document' : 'Receipt Document',
      author: 'GaranteAsy Scanner',
      subject: `Scanned ${documentType.charAt(0).toUpperCase() + documentType.slice(1)}`,
      compress: true,
      pageMargin: 20,
    };

    // Create the PDF
    const pdfPath = await createPdfFromImages(imageUris, pdfOptions);

    console.log(`✅ PDF created successfully: ${pdfPath}`);
    return pdfPath;

  } catch (error) {
    console.error('❌ Error creating PDF:', error);
    throw new Error(`Failed to create PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Example 2: Create PDF and immediately share it
 */
export async function createAndShareScannedDocuments(
  scannedImages: (CameraCapturedPicture | ImagePicker.ImagePickerAsset)[],
  documentType: 'invoice' | 'ticket' = 'invoice'
): Promise<void> {
  try {
    const imageUris = scannedImages.map(image => image.uri);

    const pdfOptions: PDFCreationOptions = {
      title: `GaranteAsy - ${documentType === 'invoice' ? 'Invoice' : 'Receipt'}`,
      author: 'GaranteAsy Scanner',
      subject: `Scanned ${documentType}`,
      compress: true,
    };

    // Create and share the PDF in one step
    await createAndSharePdf(imageUris, pdfOptions);

    console.log('✅ PDF created and shared successfully');

  } catch (error) {
    console.error('❌ Error creating and sharing PDF:', error);
    Alert.alert(
      'PDF Error',
      `Failed to create PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
      [{ text: 'OK' }]
    );
  }
}

/**
 * Example 3: Integration with Document Scanner validation callback
 */
export const handleDocumentValidation = async (
  data: (CameraCapturedPicture | ImagePicker.ImagePickerAsset)[],
  scanMode: 'invoice' | 'ticket'
) => {
  console.log(`📄 Processing ${data.length} ${scanMode}(s)...`);

  try {
    // Option 1: Create PDF and save locally
    const pdfPath = await createPdfFromScannedDocuments(data, scanMode);

    Alert.alert(
      'Success',
      `Document successfully scanned and saved as PDF!\\n\\nFile: ${pdfPath.split('/').pop()}`,
      [
        { text: 'OK' },
        {
          text: 'Share',
          onPress: () => shareExistingPdf(data, scanMode)
        }
      ]
    );

    // Option 2: Create and share immediately (alternative)
    // await createAndShareScannedDocuments(data, scanMode);

  } catch (error) {
    console.error('❌ Document validation failed:', error);
    Alert.alert(
      'Error',
      `Failed to process document: ${error instanceof Error ? error.message : 'Unknown error'}`,
      [{ text: 'OK' }]
    );
  }
};

/**
 * Example 4: Share an existing PDF (alternative approach)
 */
export async function shareExistingPdf(
  scannedImages: (CameraCapturedPicture | ImagePicker.ImagePickerAsset)[],
  documentType: 'invoice' | 'ticket'
): Promise<void> {
  try {
    await createAndShareScannedDocuments(scannedImages, documentType);
  } catch (error) {
    console.error('❌ Error sharing PDF:', error);
    Alert.alert('Error', 'Failed to share PDF', [{ text: 'OK' }]);
  }
}

/**
 * Example 5: Batch process multiple document sets
 */
export async function batchCreatePdfs(
  documentSets: {
    images: (CameraCapturedPicture | ImagePicker.ImagePickerAsset)[];
    type: 'invoice' | 'ticket';
    title?: string;
  }[]
): Promise<string[]> {
  const createdPdfs: string[] = [];

  for (let i = 0; i < documentSets.length; i++) {
    const { images, type, title } = documentSets[i];

    try {
      console.log(`📄 Processing document set ${i + 1}/${documentSets.length}...`);

      const imageUris = images.map(image => image.uri);
      const pdfOptions: PDFCreationOptions = {
        title: title || `${type === 'invoice' ? 'Invoice' : 'Receipt'} ${i + 1}`,
        author: 'GaranteAsy Scanner',
        subject: `Batch scanned ${type}`,
        compress: true,
      };

      const pdfPath = await createPdfFromImages(imageUris, pdfOptions);
      createdPdfs.push(pdfPath);

      console.log(`✅ Document set ${i + 1} processed successfully`);

    } catch (error) {
      console.error(`❌ Error processing document set ${i + 1}:`, error);
      // Continue with other documents even if one fails
    }
  }

  console.log(`✅ Batch processing complete. Created ${createdPdfs.length}/${documentSets.length} PDFs`);
  return createdPdfs;
}

// Usage in your scanner component:
/*
import { handleDocumentValidation } from '../services/PDFService/examples';

const ScannerScreen = () => {
  return (
    <DocumentScanner
      onValidation={handleDocumentValidation}
      // ... other props
    />
  );
};
*/
