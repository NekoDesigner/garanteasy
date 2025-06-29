# DocumentScanner Module

A comprehensive React Native document scanning solution for GaranteAsy that enables users to capture, review, and process documents using the device camera or gallery. This module provides a complete workflow for document digitization with multi-document support, image cropping capabilities, and document type classification.

## ✨ Features

- 📸 **Camera Capture**: Full-screen camera interface with high-quality image capture
- 🖼️ **Gallery Import**: Select and import existing images from device gallery
- 📄 **Multi-Document Support**: Scan and manage multiple documents in a single session
- � **Document Counter**: Visual indicator showing the number of scanned documents
- 🎨 **Document Type Selection**: Toggle between "Facture" (Invoice) and "Ticket" modes
- ✂️ **Image Cropping**: Advanced cropping with touch gestures and visual guides
- 👁️ **Document Review**: Full-screen preview with thumbnail navigation
- ✅ **Batch Validation**: Review and validate all scanned documents
- 🛡️ **Permission Management**: Automatic handling of camera and media permissions
- ⚡ **Error Handling**: Comprehensive error handling with user feedback
- 🎯 **Quality Optimization**: Configurable image compression and processing

## 🚀 Installation

This module requires the following Expo packages, which should already be installed in your project:

```bash
# Core dependencies
expo install expo-camera expo-image-picker expo-image-manipulator
expo install react-native-gesture-handler react-native-svg expo-router
```

### Required Dependencies

| Package | Purpose |
|---------|---------|
| `expo-camera` | Camera functionality and permissions |
| `expo-image-picker` | Gallery image selection |
| `expo-image-manipulator` | Image cropping and processing |
| `react-native-gesture-handler` | Touch gestures for cropping interface |
| `react-native-svg` | UI icons and elements |
| `expo-router` | Navigation handling |

## 📖 Usage

### Basic Integration

```tsx
import DocumentScanner from '../modules/document-scanner/DocumentScanner';
import type { CameraCapturedPicture } from 'expo-camera';
import type * as ImagePicker from 'expo-image-picker';

const MyComponent = () => {
  const handleDocumentScanned = (imageUri: string) => {
    console.log('Document captured:', imageUri);
    // Process individual document as it's scanned
  };

  const handleValidation = (
    documents: (CameraCapturedPicture | ImagePicker.ImagePickerAsset)[],
    scanMode: 'invoice' | 'ticket'
  ) => {
    console.log('Documents validated:', documents.length, 'Mode:', scanMode);
    // Process all validated documents with their metadata
  };

  const handleError = (error: Error) => {
    console.error('Scanner error:', error.message);
    // Handle scanning errors gracefully
  };

  const handleClose = () => {
    console.log('Scanner closed');
    // Handle navigation or cleanup
  };

  return (
    <DocumentScanner
      onDocumentScanned={handleDocumentScanned}
      onValidation={handleValidation}
      onError={handleError}
      onClose={handleClose}
    />
  );
};
```

### Complete Screen Implementation

```tsx
import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenView from '../components/ScreenView';
import DocumentScanner from '../modules/document-scanner/DocumentScanner';

const ScannerScreen = () => {
  const router = useRouter();

  const handleDocumentScanned = (imageUri: string) => {
    console.log('Document scanned:', imageUri);
    // Save to local state, database, or process immediately
  };

  const handleValidation = (documents, scanMode) => {
    console.log(`${documents.length} ${scanMode}s validated`);
    
    // Save documents to database or send to API
    saveDocuments(documents, scanMode);
    
    // Show success message
    Alert.alert(
      'Success', 
      `${documents.length} document(s) successfully scanned!`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleError = (error: Error) => {
    Alert.alert('Error', `Scanning failed: ${error.message}`);
  };

  const handleClose = () => {
    router.back();
  };

  const saveDocuments = async (documents, scanMode) => {
    // Implementation for saving documents
    try {
      // Save to database or API
    } catch (error) {
      console.error('Failed to save documents:', error);
    }
  };

  return (
    <ScreenView>
      <DocumentScanner
        onDocumentScanned={handleDocumentScanned}
        onValidation={handleValidation}
        onError={handleError}
        onClose={handleClose}
      />
    </ScreenView>
  );
};

export default ScannerScreen;
```

## 🔧 API Reference

### DocumentScanner Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onDocumentScanned` | `(imageUri: string) => void` | No | Called when each document is captured (receives image URI) |
| `onValidation` | `(documents: (CameraCapturedPicture \| ImagePickerAsset)[], scanMode: 'invoice' \| 'ticket') => void` | No | Called when user validates all scanned documents |
| `onError` | `(error: Error) => void` | No | Called when an error occurs during scanning |
| `onClose` | `() => void` | No | Called when the scanner is closed |
| `onSave` | `(data: Record<string, any>) => void` | No | Called to save additional metadata |
| `style` | `ViewStyle` | No | Custom styles for the main container |

### Type Definitions

```tsx
import type { CameraCapturedPicture } from 'expo-camera';
import type * as ImagePicker from 'expo-image-picker';

interface DocumentScannerProps {
  onDocumentScanned?: (data: string) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
  onValidation?: (
    data: (CameraCapturedPicture | ImagePicker.ImagePickerAsset)[], 
    scanMode: 'invoice' | 'ticket'
  ) => void;
  onSave?: (data: Record<string, any>) => void;
  style?: object;
}
```

## 🏗️ Architecture

The DocumentScanner module consists of five main components working together:

### Core Components

#### 1. **DocumentScanner** (Main Component)
- **Purpose**: Orchestrates the entire scanning workflow
- **Responsibilities**: 
  - Camera permission management
  - Photo capture and gallery selection
  - State management for scanned documents
  - Mode switching (Invoice/Ticket)

#### 2. **DocumentScannerBottom**
- **Purpose**: Bottom control panel with scanning actions
- **Features**:
  - Animated document type selector (Facture/Ticket)
  - Camera capture button with custom styling
  - Gallery import and close buttons
  - Smooth mode transition animations

#### 3. **DocumentScannedIndicator**
- **Purpose**: Visual feedback for scanned document count
- **Design**: 
  - Stacked paper icon design
  - Positioned at bottom-left of camera view
  - Numbered badge for multi-document sessions

#### 4. **DocumentReview**
- **Purpose**: Full-screen document review and editing interface
- **Capabilities**:
  - Thumbnail navigation
  - Full-size document preview
  - Add, crop, and delete operations
  - Batch validation workflow

#### 5. **SimpleCropper**
- **Purpose**: Advanced image cropping with touch gestures
- **Features**:
  - Free-form crop area manipulation
  - Touch and drag to move crop region
  - Resize handles for precise adjustments
  - Grid overlay for composition guidance
  - High-quality image processing

### Data Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  DocumentScanner │───▶│ Camera/Gallery   │───▶│ Photo Captured  │
│     (Main)       │    │    Capture       │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                                               │
         ▼                                               ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Document Review │◀───│  Photos Array    │───▶│ Simple Cropper  │
│   (Preview)     │    │   Management     │    │   (Editing)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Validation    │───▶│   Final Output   │◀───│ Cropped Images  │
│   (Callback)    │    │  (Processed)     │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🎯 User Experience

### Scanning Workflow

1. **🔒 Permission Handling**
   - Automatic camera permission request on first use
   - Media library permission for gallery access
   - Clear error messages for denied permissions

2. **📱 Scanner Interface**
   - Full-screen camera view with live preview
   - Bottom control panel with action buttons
   - Document type selector with smooth animations

3. **📄 Document Type Selection**
   - **Facture (Invoice)**: Optimized for invoice scanning
   - **Ticket**: Optimized for receipt scanning
   - Visual indicator shows selected mode

4. **📸 Capture Options**
   - **Camera Capture**: Tap center button for high-quality capture
   - **Gallery Import**: Select existing images from device gallery
   - Multiple documents can be captured in sequence

5. **📊 Progress Tracking**
   - Visual document counter shows scanned items
   - Stacked paper icon design
   - Real-time count updates

6. **👁️ Document Review**
   - Full-screen preview of all scanned documents
   - Thumbnail navigation at the bottom
   - Swipe gestures for easy navigation

7. **✂️ Image Editing**
   - Advanced cropping with touch gestures
   - Move crop area by dragging
   - Resize using corner handles
   - Grid overlay for better composition

8. **✅ Validation & Processing**
   - Review all documents before finalizing
   - Batch validation with single action
   - Return to scanning or confirm completion

### Touch Interactions

| Gesture | Action | Context |
|---------|--------|---------|
| **Tap** | Capture photo | Camera view (center button) |
| **Tap** | Select gallery | Camera view (gallery icon) |
| **Tap** | Switch document type | Bottom control panel |
| **Swipe** | Navigate documents | Review screen |
| **Drag** | Move crop area | Cropping interface |
| **Pinch** | Resize crop area | Cropping interface |
| **Tap** | Add/Delete/Crop | Review action buttons |

## ⚙️ Configuration

### Camera Settings

```tsx
// Default camera configuration
const cameraConfig = {
  quality: 0.8,        // Image compression (0.0 - 1.0)
  base64: false,       // Disable base64 for better performance
  skipProcessing: false // Enable processing for better quality
};
```

### Image Processing

```tsx
// Cropping configuration
const cropConfig = {
  format: SaveFormat.JPEG,
  compress: 0.8,
  base64: false
};
```

### Styling Configuration

The module uses your project's design system:

```tsx
// Import your constants
import { COLORS, SIZES } from '../../constants';

// Customizable elements
const styleConfig = {
  primaryColor: COLORS.primary,
  backgroundColor: COLORS.background,
  textColor: COLORS.text,
  borderRadius: SIZES.borderRadius
};
```

## 🚨 Error Handling

The module provides comprehensive error handling for various scenarios:

### Permission Errors
```tsx
// Camera permission denied
onError?.(new Error('Camera permission denied'));

// Gallery permission denied  
onError?.(new Error('Media library permission denied'));
```

### Capture Errors
```tsx
// Camera capture failed
onError?.(new Error('Failed to capture image'));

// Gallery selection failed
onError?.(new Error('Failed to select image from gallery'));
```

### Processing Errors
```tsx
// Image cropping failed
onError?.(new Error('Failed to process cropped image'));

// Invalid image format
onError?.(new Error('Unsupported image format'));
```

### Best Practices for Error Handling

```tsx
const handleError = (error: Error) => {
  console.error('DocumentScanner Error:', error);
  
  // Show user-friendly messages
  switch (error.message) {
    case 'Camera permission denied':
      Alert.alert(
        'Camera Access Required',
        'Please enable camera access in Settings to scan documents.',
        [{ text: 'OK' }]
      );
      break;
      
    case 'Media library permission denied':
      Alert.alert(
        'Gallery Access Required', 
        'Please enable gallery access to import images.',
        [{ text: 'OK' }]
      );
      break;
      
    default:
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
  }
};
```

## 🎨 Customization

### Styling the Scanner

```tsx
// Custom container styles
<DocumentScanner
  style={{
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    margin: 20
  }}
  // ... other props
/>
```

### Theming

The module respects your app's color scheme:

```tsx
// constants/Colors.ts
export const COLORS = {
  primary: '#007AFF',
  background: '#FFFFFF', 
  text: '#000000',
  // ... other colors
};
```

### Custom Icons

Replace default icons in your components:

```tsx
// components/ui/Icons/CustomCameraIcon.tsx
export const CustomCameraIcon = () => (
  <YourCustomIcon />
);
```

## 🧪 Testing

### Unit Tests

```tsx
// __tests__/DocumentScanner.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import DocumentScanner from '../DocumentScanner';

test('calls onDocumentScanned when photo is taken', () => {
  const mockOnDocumentScanned = jest.fn();
  
  const { getByTestId } = render(
    <DocumentScanner onDocumentScanned={mockOnDocumentScanned} />
  );
  
  // Simulate photo capture
  fireEvent.press(getByTestId('capture-button'));
  
  expect(mockOnDocumentScanned).toHaveBeenCalled();
});
```

### Integration Tests

```tsx
// Test complete scanning workflow
test('complete scanning workflow', async () => {
  const mockOnValidation = jest.fn();
  
  const { getByTestId } = render(
    <DocumentScanner onValidation={mockOnValidation} />
  );
  
  // Take photo
  fireEvent.press(getByTestId('capture-button'));
  
  // Review documents
  fireEvent.press(getByTestId('review-button'));
  
  // Validate
  fireEvent.press(getByTestId('validate-button'));
  
  expect(mockOnValidation).toHaveBeenCalledWith(
    expect.any(Array),
    expect.stringMatching(/invoice|ticket/)
  );
});
```

## 🔗 Dependencies

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `expo-camera` | Latest | Camera functionality and permissions |
| `expo-image-picker` | Latest | Gallery image selection |
| `expo-image-manipulator` | Latest | Image cropping and processing |
| `react-native-gesture-handler` | Latest | Touch gestures for cropping |
| `react-native-svg` | Latest | UI icons and vector graphics |
| `expo-router` | Latest | Navigation handling |

### Development Dependencies

```json
{
  "devDependencies": {
    "@testing-library/react-native": "^12.0.0",
    "@types/react": "^18.0.0",
    "@types/react-native": "^0.72.0",
    "jest": "^29.0.0"
  }
}
```

## 📝 Changelog

### Version 1.0.0
- ✨ Initial release with camera capture
- ✨ Gallery import functionality
- ✨ Multi-document support
- ✨ Document type selection (Invoice/Ticket)
- ✨ Basic image cropping

### Version 1.1.0
- 🎨 Enhanced UI with animations
- ✂️ Advanced cropping with touch gestures
- 📱 Improved mobile responsiveness
- 🐛 Bug fixes for permission handling

### Version 1.2.0
- 🔄 Batch validation workflow
- 📊 Document counter improvements
- ⚡ Performance optimizations
- 🧪 Added comprehensive testing

## 🤝 Contributing

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd garanteasy/modules/document-scanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests**
   ```bash
   npm test
   ```

### Code Style

- Use TypeScript for type safety
- Follow React Native best practices
- Write tests for new features
- Document public APIs

### Pull Request Process

1. Create a feature branch
2. Write tests for new functionality
3. Update documentation
4. Submit pull request with clear description

## 📄 License

This module is part of the GaranteAsy project and follows the project's licensing terms.

## 🆘 Support

For issues and questions:

1. **Check the documentation** - Most common issues are covered here
2. **Search existing issues** - Your problem might already be solved
3. **Create a new issue** - Provide detailed reproduction steps
4. **Contact the team** - For urgent production issues

## 📚 Additional Resources

- [Expo Camera Documentation](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Expo Image Picker Documentation](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [GaranteAsy Design System](../../constants/README.md)

---

**Built with ❤️ for GaranteAsy**
