# DocumentScanner Component

A React Native document scanner component for GaranteAsy that allows users to capture documents using the device camera or select from the gallery. The component provides a complete document scanning experience with multi-document support, live previews, and validation.

## Features

- 📸 **Camera Capture**: Real-time camera view with document capture capabilities
- 🖼️ **Gallery Selection**: Import existing images from device gallery
- 📄 **Multi-Document Support**: Scan multiple documents in a single session
- 🔍 **Live Document Counter**: Visual indicator showing number of scanned documents
- ✅ **Document Validation**: Review and validate scanned documents before processing
- 🎨 **Document Type Selection**: Switch between "Facture" and "Ticket" scanning modes
- 🛡️ **Permission Handling**: Automatic camera and media library permission management
- ⚡ **Error Handling**: Comprehensive error handling with user-friendly alerts
- 🎯 **Quality Control**: Configurable image quality settings (0.8 compression)

## Installation

The component requires the following Expo packages:
- `expo-camera` - For camera functionality
- `expo-image-picker` - For gallery image selection
- `expo-router` - For navigation handling

These dependencies are already installed in your project.

## Usage

### Basic Implementation

```tsx
import DocumentScanner from '../modules/document-scanner/DocumentScanner';

const MyComponent = () => {
  const handleDocumentScanned = (imageUri: string) => {
    console.log('Document scanned:', imageUri);
    // Process each scanned document
  };

  const handleError = (error: Error) => {
    console.error('Scanner error:', error);
    // Handle scanning errors
  };

  const handleValidation = (imageUris: string[]) => {
    console.log('Documents validated:', imageUris);
    // Process all validated documents
  };

  const handleClose = () => {
    console.log('Scanner closed');
    // Handle scanner closure
  };

  return (
    <DocumentScanner
      onDocumentScanned={handleDocumentScanned}
      onError={handleError}
      onValidation={handleValidation}
      onClose={handleClose}
    />
  );
};
```

### Complete Example (Scanner Screen)

```tsx
import React from 'react';
import { Alert } from 'react-native';
import ScreenView from '../components/ScreenView';
import DocumentScanner from '../modules/document-scanner/DocumentScanner';

const ScannerScreen = () => {
  const handleDocumentScanned = (imageUri: string) => {
    console.log('Document scanned:', imageUri);
    // Save to database or process the document
  };

  const handleError = (error: Error) => {
    console.error('Scanner error:', error);
    Alert.alert('Error', 'Failed to scan document: ' + error.message);
  };

  const handleValidation = (imageUris: string[]) => {
    console.log('Documents validated:', imageUris);
    Alert.alert('Success', 'Documents have been successfully scanned!');
    // Navigate to next screen or save documents
  };

  const handleClose = () => {
    console.log('Scanner closed');
    // Handle navigation back
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
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onDocumentScanned` | `(data: string) => void` | No | Callback fired when a single document is scanned (receives image URI) |
| `onError` | `(error: Error) => void` | No | Callback fired when an error occurs during scanning |
| `onClose` | `() => void` | No | Callback fired when the scanner is closed |
| `onValidation` | `(data: string[]) => void` | No | Callback fired when user validates all scanned documents (receives array of image URIs) |
| `style` | `object` | No | Custom styles for the main container |

## Component Architecture

The DocumentScanner consists of three main sub-components:

### 1. DocumentScanner (Main Component)
- Manages camera permissions and state
- Handles photo capture and gallery selection
- Maintains array of scanned document URIs
- Provides validation workflow

### 2. DocumentScannedIndicator
- Visual indicator showing number of scanned documents
- Stacked paper icon design
- Positioned at bottom-left of camera view
- Shows count badge when multiple documents are scanned

### 3. DocumentScannerBottom
- Bottom control panel with action buttons
- Document type selector (Facture/Ticket)
- Camera capture button
- Gallery import and close buttons

## Permissions

The component automatically handles the following permissions:

- **Camera Permission**: Required for document capture
- **Media Library Permission**: Required for gallery image selection

Users are prompted with native permission dialogs when permissions are needed. If permissions are denied, appropriate error messages are displayed.

## User Flow

1. **Permission Check**: Component requests camera permissions on mount
2. **Scanner Interface**: Full-screen camera view with bottom controls
3. **Document Type Selection**: Choose between "Facture" and "Ticket" modes
4. **Capture Options**:
   - **Camera**: Tap center button to capture document
   - **Gallery**: Tap gallery icon to select existing image
5. **Multi-Document Support**: Continue scanning additional documents
6. **Document Counter**: Visual indicator shows number of scanned documents
7. **Validation**: Tap checkmark button to validate all scanned documents
8. **Close**: Tap X button to close scanner

## Camera Settings

- **Facing**: Back camera (default)
- **Quality**: 0.8 compression ratio
- **Base64**: Disabled for better performance
- **Skip Processing**: Disabled for better quality

## Error Handling

The component handles various error scenarios:

- **Permission Denied**: Shows permission request UI
- **Camera Unavailable**: Displays appropriate error message
- **Image Capture Failed**: Logs error and calls `onError` callback
- **Gallery Access Failed**: Shows permission error alert

## Styling

The component uses a consistent design system with:

- **Colors**: Imported from `../../constants/Colors`
- **Sizes**: Imported from `../../constants/Sizes`
- **Responsive Design**: Adapts to different screen sizes
- **Custom Styling**: Accepts custom `style` prop for container

## Dependencies

- `expo-camera`: Camera functionality
- `expo-image-picker`: Gallery image selection
- `expo-router`: Navigation handling
- `react-native`: Core React Native components

## Notes

- The component uses `expo-router` for navigation (back button functionality)
- Images are stored as local URIs and passed to parent components
- The validation callback receives an array of all scanned document URIs
- Component automatically handles permission states and loading states
