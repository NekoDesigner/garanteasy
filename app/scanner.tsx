import { CameraCapturedPicture } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';

import ScreenView from '../components/ScreenView';
import { DatabaseSaveException } from '../exceptions/DatabaseSaveException';
import { useDocumentRepository } from '../hooks/useDocumentRepository/useDocumentRepository';
import { Document } from '../models/Document/Document';
import DocumentScanner from '../modules/document-scanner/DocumentScanner';
import { useUserContext } from '../providers/UserContext';

const ScannerScreen = () => {
  const { user } = useUserContext();
  const router = useRouter();
  const { saveDocument } = useDocumentRepository({ ownerId: user?.id || '' });

  const handleError = (error: Error) => {
    Alert.alert('Error', 'Failed to scan document: ' + error.message);
  };

  const handleValidation = async (data: (CameraCapturedPicture | ImagePicker.ImagePickerAsset)[], scanMode: 'invoice' | 'ticket') => {
    try {
      // Import the PDF service
      const { createPdfFromImages } = await import('../services/PDFService');

      // Extract image URIs from the data
      const imageUris = data.map(item => item.uri);

      // Create PDF with appropriate title based on scan mode
      const pdfOptions = {
        title: scanMode === 'invoice' ? 'Facture' : 'Ticket de caisse',
        author: 'GarantEasy Scanner',
        subject: `Scanned ${scanMode}`,
        compress: true,
        useTimestamp: true,
      };

      // Create PDF and get file path
      const pdfPath = await createPdfFromImages(imageUris, pdfOptions);
      const fileName = pdfPath.split('/').pop() || 'document.pdf';

      /**
       * TODO: Enregitrer le PDF comme Entity Document.
       */
      let document = new Document({
        ownerId: user?.id || '',
        name: fileName,
        filename: fileName,
        type: scanMode,
        mimetype: 'application/pdf',
        fileSource: 'local',
        filePath: pdfPath,
      });
      document = await saveDocument(document);
      router.push({
        pathname: '/create-item',
        params: { documentId: document.id! }, // Pass the PDF file name as a parameter
      });

    } catch (error) {
      console.error('Error creating PDF:', error);
      Alert.alert('Error', `Failed to create PDF: ${(error instanceof Error || error instanceof DatabaseSaveException) ? error.message : 'Unknown error'}`);
    }
  };

  const handleClose = () => {
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