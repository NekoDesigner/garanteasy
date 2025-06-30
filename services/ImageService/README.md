# ImageService

A comprehensive image management service for the GaranteAsy app that handles saving, organizing, and managing images in the device's filesystem.

## Features

- ✅ Save item images to organized directories
- ✅ Save document images to organized directories  
- ✅ Automatic file naming with unique identifiers
- ✅ Image file existence checking
- ✅ Image cleanup utilities
- ✅ TypeScript support with full type definitions
- ✅ Organized directory structure

## Directory Structure

The ImageService creates and manages the following directory structure:

```
📁 ${FileSystem.documentDirectory}
├── 📁 images/
│   ├── 📁 items/           # Item pictures
│   │   ├── item-{id}-{timestamp}.jpg
│   │   └── item-{id}-{timestamp}.jpg
│   └── 📁 documents/       # Document images  
│       ├── doc-{id}-{timestamp}.jpg
│       └── doc-{id}-{timestamp}.jpg
```

## Usage

### Basic Item Image Saving

```typescript
import { ImageService } from '../services/ImageService';

// Save an item image
const savedImageUri = await ImageService.saveItemImage(imageUri);

// Save with item ID for better organization
const savedImageUri = await ImageService.saveItemImage(imageUri, itemId);

// Save with custom options
const savedImageUri = await ImageService.saveItemImage(imageUri, itemId, {
  format: 'png',
  filename: 'custom-name.png'
});
```

### Document Image Saving

```typescript
// Save a document image
const savedImageUri = await ImageService.saveDocumentImage(imageUri);

// Save with document ID
const savedImageUri = await ImageService.saveDocumentImage(imageUri, documentId);
```

### Image Information and Management

```typescript
// Get image information
const imageInfo = await ImageService.getImageInfo(imageUri);
console.log(imageInfo.uri, imageInfo.size);

// Check if image exists
const exists = await ImageService.imageExists(imageUri);

// Check if URI is a local file
const isLocal = ImageService.isLocalFileUri(imageUri);

// Delete an image
await ImageService.deleteImage(imageUri);
```

### Directory Management

```typescript
// List all item images
const itemImages = await ImageService.listItemImages();

// List all document images  
const docImages = await ImageService.listDocumentImages();

// Cleanup orphaned images (for maintenance)
const deletedCount = await ImageService.cleanupOrphanedImages(
  existingItemIds,
  existingDocumentIds
);
```

## Integration with React Native Image Component

The saved image URIs can be used directly with React Native's Image component:

```tsx
import { Image } from 'react-native';

// After saving an image
const savedImageUri = await ImageService.saveItemImage(originalUri, itemId);

// Use in Image component
<Image source={{ uri: savedImageUri }} style={styles.image} />
```

## Integration with Create Item Flow

Here's how to integrate the ImageService with the item creation flow:

```typescript
const takePhoto = async () => {
  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      // Save image to permanent storage
      const savedImageUri = await ImageService.saveItemImage(result.assets[0].uri);
      
      // Update item with saved image URI
      setItem(prevItem => new Item({
        ...prevItem,
        picture: savedImageUri,
      }));
    }
  } catch (error) {
    console.error('Error taking photo:', error);
  }
};
```

## Error Handling

The ImageService includes comprehensive error handling:

- **Directory initialization**: Automatically creates required directories
- **File system errors**: Catches and re-throws with descriptive messages
- **File existence checks**: Safe operations that don't fail on missing files
- **Image format handling**: Supports JPEG and PNG formats

## File Naming Convention

### Item Images
- Format: `item-{itemId}-{timestamp}.{extension}`
- Example: `item-abc123-1640995200000.jpg`
- If no itemId: `item-{randomId}-{timestamp}.{extension}`

### Document Images  
- Format: `doc-{documentId}-{timestamp}.{extension}`
- Example: `doc-xyz789-1640995200000.jpg`
- If no documentId: `doc-{randomId}-{timestamp}.{extension}`

## Performance Considerations

- Images are copied (not moved) to preserve originals during development
- Automatic cleanup utilities help manage storage space
- Organized directory structure improves file access performance
- Unique naming prevents file conflicts

## Best Practices

1. **Always save images after capture/selection**:
   ```typescript
   const savedUri = await ImageService.saveItemImage(originalUri, itemId);
   ```

2. **Update models with saved URIs**:
   ```typescript
   setItem(prev => ({ ...prev, picture: savedUri }));
   ```

3. **Use item/document IDs when available**:
   ```typescript
   // Better organization
   await ImageService.saveItemImage(uri, itemId);
   ```

4. **Handle errors appropriately**:
   ```typescript
   try {
     const savedUri = await ImageService.saveItemImage(uri);
   } catch (error) {
     Alert.alert('Error', 'Failed to save image');
   }
   ```

5. **Regular cleanup for maintenance**:
   ```typescript
   // Periodically clean orphaned images
   await ImageService.cleanupOrphanedImages(itemIds, docIds);
   ```

## Dependencies

- `expo-file-system` - File system operations and directory management

## TypeScript Support

The service is fully typed with TypeScript interfaces:

```typescript
interface ImageSaveOptions {
  format?: 'jpeg' | 'png';
  filename?: string;
  directory?: string;
}

interface ImageInfo {
  uri: string;
  width?: number;
  height?: number;
  size?: number;
}
```
