import React from 'react';
import { Alert } from 'react-native';

import ScreenView from '../components/ScreenView';
import DocumentScanner from '../modules/document-scanner/DocumentScanner';

const ScannerScreen = () => {
  const handleDocumentScanned = (imageUri: string) => {
    console.log('Document scanned:', imageUri);
    // Here you can process the scanned document
    // For example, save it to your database or send it to a server
  };

  const handleError = (error: Error) => {
    console.error('Scanner error:', error);
    Alert.alert('Error', 'Failed to scan document: ' + error.message);
  };

  const handleValidation = (imageUri: string[]) => {
    console.log('Document validated:', imageUri);
    Alert.alert('Success', 'Document has been successfully scanned and validated!');
  };

  const handleClose = () => {
    console.log('Scanner closed');
  };

  return (
    <ScreenView>
      <DocumentScanner
        onDocumentScanned={handleDocumentScanned}
        onError={handleError}
        onValidation={handleValidation}
        onClose={handleClose}
      />
    </ScreenView>
  );
};

export default ScannerScreen;