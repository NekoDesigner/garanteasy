import { CameraCapturedPicture } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert } from 'react-native';

import ScreenView from '../components/ScreenView';
import DocumentScanner from '../modules/document-scanner/DocumentScanner';

const ScannerScreen = () => {
  const handleError = (error: Error) => {
    Alert.alert('Error', 'Failed to scan document: ' + error.message);
  };

  const handleValidation = async (data: (CameraCapturedPicture | ImagePicker.ImagePickerAsset)[], scanMode: 'invoice' | 'ticket') => {
    try {
      // Import the PDF service
      const { createPdfFromImages, createAndSharePdf } = await import('../services/PDFService');

      // Extract image URIs from the data
      const imageUris = data.map(item => item.uri);

      // Create PDF with appropriate title based on scan mode
      const pdfOptions = {
        title: scanMode === 'invoice' ? 'Invoice Document' : 'Receipt Document',
        author: 'GarantEasy Scanner',
        subject: `Scanned ${scanMode}`,
        compress: true,
      };

      // Create PDF and get file path
      const pdfPath = await createPdfFromImages(imageUris, pdfOptions);
      const fileName = pdfPath.split('/').pop() || 'document.pdf';

      console.log('PDF created at:', pdfPath);
      console.log('PDF saved locally in documents directory');

      // Show success alert with options to share or just acknowledge
      Alert.alert(
        'Success',
        `Document has been successfully scanned and saved as:\n"${fileName}"\n\nLocation: Documents folder`,
        [
          {
            text: 'Share PDF',
            onPress: async () => {
              try {
                await createAndSharePdf(imageUris, pdfOptions);
              } catch (shareError) {
                console.error('Error sharing PDF:', shareError);
                Alert.alert('Error', 'Failed to share PDF');
              }
            },
          },
          {
            text: 'OK',
            style: 'default',
          },
        ]
      );
    } catch (error) {
      console.error('Error creating PDF:', error);
      Alert.alert('Error', `Failed to create PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleClose = () => {
    console.log('Scanner closed');
  };

  return (
    <ScreenView>
      <DocumentScanner
        onError={handleError}
        onValidation={handleValidation}
        onClose={handleClose}
      />
    </ScreenView>
  );
};

export default ScannerScreen;