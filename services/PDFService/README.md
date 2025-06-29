# PDF Service

A comprehensive PDF creation service for the GaranteAsy app that converts scanned document images into PDF files using the `pdf-lib` library.

## Features

- ✅ Create PDF documents from multiple image URIs
- ✅ Automatic page sizing based on image dimensions
- ✅ Configurable PDF metadata (title, author, subject)
- ✅ Image compression and optimization
- ✅ Share PDFs directly from the app
- ✅ File management utilities (list, delete, get info)
- ✅ TypeScript support with full type definitions

## Usage

### Basic PDF Creation

```typescript
import { createPdfFromImages } from '../services/PDFService';

const imageUris = ['file://path/to/image1.jpg', 'file://path/to/image2.jpg'];

try {
  const pdfPath = await createPdfFromImages(imageUris);
  console.log('PDF created at:', pdfPath);
} catch (error) {
  console.error('Error creating PDF:', error);
}
```

### PDF Creation with Options

```typescript
import { createPdfFromImages, PDFCreationOptions } from '../services/PDFService';

const options: PDFCreationOptions = {
  title: 'Invoice Document',
  author: 'GaranteAsy Scanner',
  subject: 'Scanned Invoice',
  compress: true,
  pageMargin: 20,
};

const pdfPath = await createPdfFromImages(imageUris, options);
```

### Create and Share PDF

```typescript
import { createAndSharePdf } from '../services/PDFService';

// This will create the PDF and immediately open the share dialog
await createAndSharePdf(imageUris, {
  title: 'Receipt Document',
  author: 'GaranteAsy Scanner',
});
```

### File Management

```typescript
import { listPdfFiles, getPdfInfo, deletePdf } from '../services/PDFService';

// List all PDF files
const pdfFiles = await listPdfFiles();

// Get file info
const fileInfo = await getPdfInfo('/path/to/document.pdf');

// Delete a PDF file
await deletePdf('/path/to/document.pdf');
```

## Integration with Document Scanner

The PDF service integrates seamlessly with the Document Scanner module:

```typescript
import { CameraCapturedPicture } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { createPdfFromImages } from '../services/PDFService';

const handleValidation = async (
  data: (CameraCapturedPicture | ImagePicker.ImagePickerAsset)[],
  scanMode: 'invoice' | 'ticket'
) => {
  try {
    const imageUris = data.map(item => item.uri);
    
    const pdfOptions = {
      title: scanMode === 'invoice' ? 'Invoice Document' : 'Receipt Document',
      author: 'GaranteAsy Scanner',
      subject: `Scanned ${scanMode}`,
      compress: true,
    };
    
    const pdfPath = await createPdfFromImages(imageUris, pdfOptions);
    console.log('PDF created successfully:', pdfPath);
    
  } catch (error) {
    console.error('Error creating PDF:', error);
  }
};
```

## API Reference

### Functions

#### `createPdfFromImages(imageUris, options?)`

Creates a PDF document from an array of image URIs.

**Parameters:**
- `imageUris: string[]` - Array of image file URIs
- `options: PDFCreationOptions` - Optional configuration object

**Returns:** `Promise<string>` - Path to the created PDF file

#### `createAndSharePdf(imageUris, options?)`

Creates a PDF document and immediately opens the system share dialog.

**Parameters:**
- `imageUris: string[]` - Array of image file URIs  
- `options: PDFCreationOptions` - Optional configuration object

**Returns:** `Promise<void>`

#### `getPdfInfo(filePath)`

Gets information about a PDF file.

**Parameters:**
- `filePath: string` - Path to the PDF file

**Returns:** `Promise<FileSystem.FileInfo>` - File information object

#### `deletePdf(filePath)`

Deletes a PDF file from the file system.

**Parameters:**
- `filePath: string` - Path to the PDF file to delete

**Returns:** `Promise<void>`

#### `listPdfFiles()`

Lists all PDF files in the documents directory.

**Returns:** `Promise<string[]>` - Array of PDF file paths

### Types

#### `PDFCreationOptions`

Configuration options for PDF creation:

```typescript
interface PDFCreationOptions {
  title?: string;        // PDF document title
  author?: string;       // PDF document author
  subject?: string;      // PDF document subject
  compress?: boolean;    // Enable compression (default: true)
  pageMargin?: number;   // Page margin in points (default: 20)
  imageQuality?: number; // Image quality (not implemented yet)
}
```

#### `ImageInfo`

Information about an image:

```typescript
interface ImageInfo {
  uri: string;      // Image file URI
  width?: number;   // Image width in pixels
  height?: number;  // Image height in pixels
}
```

## Error Handling

The PDF service includes comprehensive error handling:

- **No images provided**: Throws error if `imageUris` array is empty
- **File system errors**: Catches and re-throws file system operation errors
- **PDF creation errors**: Handles pdf-lib specific errors
- **Individual image errors**: Continues processing even if individual images fail

## Dependencies

- `pdf-lib` - PDF creation and manipulation
- `expo-file-system` - File system operations
- `expo-sharing` - Native sharing functionality

## Performance Considerations

- Large images are automatically scaled to fit page dimensions
- Compression is enabled by default to reduce file size
- Images are processed sequentially to avoid memory issues
- Base64 encoding is used for cross-platform compatibility

## File Storage

PDFs are created in the app's document directory (`FileSystem.documentDirectory`) with unique timestamps to avoid naming conflicts. The filename format is:

```
scanned-document-YYYY-MM-DDTHH-mm-ss-sssZ.pdf
```

## Browser Support

This service is designed for React Native applications and uses Expo APIs. It is not compatible with web browsers in its current form.
