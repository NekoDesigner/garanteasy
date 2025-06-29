import { SaveFormat, useImageManipulator } from 'expo-image-manipulator';
import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  PanResponder,
} from 'react-native';
import { COLORS } from '../../constants';

interface SimpleCropperProps {
  imageUri: string;
  onCropComplete: (croppedUri: string) => void;
  onCancel: () => void;
  visible: boolean;
}


const SimpleCropper: React.FC<SimpleCropperProps> = ({
  imageUri,
  onCropComplete,
  onCancel,
  visible,
}) => {
  // Use useImageManipulator hook
  const manipulatorContext = useImageManipulator(imageUri);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [displayLayout, setDisplayLayout] = useState({ width: 0, height: 0 });
  const [testImage, setTestImage] = useState<string | null>(null);

  // Crop area as percentage of the displayed image area (0 to 1)
  // We'll calculate this relative to the actual image display area, not the full container
  const [cropPercentage, setCropPercentage] = useState({
    x: 0.15, // 15% from left of displayed image
    y: 0.15, // 15% from top of displayed image
    width: 0.7, // 70% width of displayed image
    height: 0.7, // 70% height of displayed image
  });

  const handleImageLoad = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.source;
    setImageSize({ width, height });
  }, []);

  const handleImageLayout = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setDisplayLayout({ width, height });
  }, []);

  // Calculate the actual displayed image dimensions within the container (for resizeMode="contain")
  const getDisplayedImageDimensions = useCallback(() => {
    if (!imageSize.width || !imageSize.height || !displayLayout.width || !displayLayout.height) {
      return { width: 0, height: 0, offsetX: 0, offsetY: 0 };
    }

    const imageAspectRatio = imageSize.width / imageSize.height;
    const containerAspectRatio = displayLayout.width / displayLayout.height;

    let displayedWidth, displayedHeight, offsetX, offsetY;

    if (imageAspectRatio > containerAspectRatio) {
      // Image is wider - fit to container width
      displayedWidth = displayLayout.width;
      displayedHeight = displayLayout.width / imageAspectRatio;
      offsetX = 0;
      offsetY = (displayLayout.height - displayedHeight) / 2;
    } else {
      // Image is taller - fit to container height
      displayedWidth = displayLayout.height * imageAspectRatio;
      displayedHeight = displayLayout.height;
      offsetX = (displayLayout.width - displayedWidth) / 2;
      offsetY = 0;
    }

    return { width: displayedWidth, height: displayedHeight, offsetX, offsetY };
  }, [imageSize, displayLayout]);

  // Pan responder for top-left corner
  const topLeftPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: (evt, gestureState) => {
      const displayedImage = getDisplayedImageDimensions();
      if (!displayedImage.width || !displayedImage.height) return;

      // Convert gesture delta to displayed image percentage
      const deltaXPercent = gestureState.dx / displayedImage.width;
      const deltaYPercent = gestureState.dy / displayedImage.height;

      // Calculate new position ensuring we don't go outside bounds
      const newX = Math.max(0, Math.min(cropPercentage.x + cropPercentage.width - 0.1,
        cropPercentage.x + deltaXPercent));
      const newY = Math.max(0, Math.min(cropPercentage.y + cropPercentage.height - 0.1,
        cropPercentage.y + deltaYPercent));

      // Adjust width and height based on new position
      const newWidth = cropPercentage.width - (newX - cropPercentage.x);
      const newHeight = cropPercentage.height - (newY - cropPercentage.y);

      // Ensure minimum crop size
      if (newWidth >= 0.1 && newHeight >= 0.1) {
        setCropPercentage({
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });
      }
    },
    onPanResponderRelease: () => {},
  });

  // Pan responder for top-right corner
  const topRightPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: (evt, gestureState) => {
      const displayedImage = getDisplayedImageDimensions();
      if (!displayedImage.width || !displayedImage.height) return;

      const deltaXPercent = gestureState.dx / displayedImage.width;
      const deltaYPercent = gestureState.dy / displayedImage.height;

      // Adjust width and y position
      const newWidth = Math.max(0.1, Math.min(1 - cropPercentage.x,
        cropPercentage.width + deltaXPercent));
      const newY = Math.max(0, Math.min(cropPercentage.y + cropPercentage.height - 0.1,
        cropPercentage.y + deltaYPercent));
      const newHeight = cropPercentage.height - (newY - cropPercentage.y);

      if (newHeight >= 0.1) {
        setCropPercentage(prev => ({
          ...prev,
          y: newY,
          width: newWidth,
          height: newHeight,
        }));
      }
    },
    onPanResponderRelease: () => {},
  });

  // Pan responder for bottom-left corner
  const bottomLeftPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: (evt, gestureState) => {
      const displayedImage = getDisplayedImageDimensions();
      if (!displayedImage.width || !displayedImage.height) return;

      const deltaXPercent = gestureState.dx / displayedImage.width;
      const deltaYPercent = gestureState.dy / displayedImage.height;

      // Adjust x position and height
      const newX = Math.max(0, Math.min(cropPercentage.x + cropPercentage.width - 0.1,
        cropPercentage.x + deltaXPercent));
      const newWidth = cropPercentage.width - (newX - cropPercentage.x);
      const newHeight = Math.max(0.1, Math.min(1 - cropPercentage.y,
        cropPercentage.height + deltaYPercent));

      if (newWidth >= 0.1) {
        setCropPercentage(prev => ({
          ...prev,
          x: newX,
          width: newWidth,
          height: newHeight,
        }));
      }
    },
    onPanResponderRelease: () => {},
  });

  // Pan responder for bottom-right corner
  const bottomRightPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: (evt, gestureState) => {
      const displayedImage = getDisplayedImageDimensions();
      if (!displayedImage.width || !displayedImage.height) return;

      const deltaXPercent = gestureState.dx / displayedImage.width;
      const deltaYPercent = gestureState.dy / displayedImage.height;

      // Calculate new dimensions ensuring we don't go outside bounds
      const newWidth = Math.max(0.1, Math.min(1 - cropPercentage.x,
        cropPercentage.width + deltaXPercent));
      const newHeight = Math.max(0.1, Math.min(1 - cropPercentage.y,
        cropPercentage.height + deltaYPercent));

      setCropPercentage(prev => ({
        ...prev,
        width: newWidth,
        height: newHeight,
      }));
    },
    onPanResponderRelease: () => {},
  });

  // Pan responder for moving the entire crop area
  const cropAreaPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: (evt, gestureState) => {
      const displayedImage = getDisplayedImageDimensions();
      if (!displayedImage.width || !displayedImage.height) return;

      const deltaXPercent = gestureState.dx / displayedImage.width;
      const deltaYPercent = gestureState.dy / displayedImage.height;

      // Calculate new position ensuring the crop area stays within bounds
      const newX = Math.max(0, Math.min(1 - cropPercentage.width,
        cropPercentage.x + deltaXPercent));
      const newY = Math.max(0, Math.min(1 - cropPercentage.height,
        cropPercentage.y + deltaYPercent));

      setCropPercentage(prev => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    },
    onPanResponderRelease: () => {},
  });

  // Perform crop using useImageManipulator hook
  const handleCrop = async () => {
    if (!imageSize.width || !imageSize.height) {
      Alert.alert('Erreur', 'Impossible de charger les dimensions de l&apos;image');
      return;
    }

    setIsLoading(true);
    try {
      // Get the actual displayed image dimensions
      const displayedImage = getDisplayedImageDimensions();

      if (displayedImage.width === 0 || displayedImage.height === 0) {
        Alert.alert('Erreur', 'Impossible de calculer les dimensions de l&apos;image affichée');
        return;
      }

      // Convert crop percentages directly to actual image coordinates
      // The cropPercentage values represent positions within the displayed image area
      // We need to map these to the actual full-resolution image

      // First, get the crop coordinates within the displayed image (in pixels)
      const cropXInDisplayed = cropPercentage.x * displayedImage.width;
      const cropYInDisplayed = cropPercentage.y * displayedImage.height;
      const cropWidthInDisplayed = cropPercentage.width * displayedImage.width;
      const cropHeightInDisplayed = cropPercentage.height * displayedImage.height;

      // Then scale these coordinates to the actual image size
      const scaleX = imageSize.width / displayedImage.width;
      const scaleY = imageSize.height / displayedImage.height;

      const actualCropX = cropXInDisplayed * scaleX;
      const actualCropY = cropYInDisplayed * scaleY;
      const actualCropWidth = cropWidthInDisplayed * scaleX;
      const actualCropHeight = cropHeightInDisplayed * scaleY;

      // Use useImageManipulator context with chainable API
      const croppedImage = await manipulatorContext
        .crop({
          originX: Math.round(actualCropX),
          originY: Math.round(actualCropY),
          width: Math.round(actualCropWidth),
          height: Math.round(actualCropHeight),
        })
        .renderAsync();

      // Save the cropped image
      const result = await croppedImage.saveAsync({
        compress: 1,
        format: SaveFormat.JPEG,
      });

      setTestImage(result.uri);
      onCropComplete(result.uri);
    } catch (error) {
      console.error('Erreur lors du rognage:', error);
      Alert.alert('Erreur', 'Impossible de rogner l&apos;image');
    } finally {
      setIsLoading(false);
    }
  };

  if (!visible) return null;

  // Calculate crop area position and size for display
  const displayedImage = getDisplayedImageDimensions();

  // The crop area should be positioned within the displayed image bounds
  // We need to ensure the crop overlay is only within the actual image area
  let cropLeft, cropTop, cropWidth, cropHeight;

  if (displayedImage.width > 0 && displayedImage.height > 0) {
    // Convert crop percentages to container percentages (accounting for image offset)
    const imageOffsetXPercent = displayedImage.offsetX / displayLayout.width * 100;
    const imageOffsetYPercent = displayedImage.offsetY / displayLayout.height * 100;
    const imageWidthPercent = displayedImage.width / displayLayout.width * 100;
    const imageHeightPercent = displayedImage.height / displayLayout.height * 100;

    // Calculate crop area position relative to the container
    cropLeft = imageOffsetXPercent + (cropPercentage.x * imageWidthPercent);
    cropTop = imageOffsetYPercent + (cropPercentage.y * imageHeightPercent);
    cropWidth = cropPercentage.width * imageWidthPercent;
    cropHeight = cropPercentage.height * imageHeightPercent;
  } else {
    // Fallback if image dimensions not available
    cropLeft = cropPercentage.x * 100;
    cropTop = cropPercentage.y * 100;
    cropWidth = cropPercentage.width * 100;
    cropHeight = cropPercentage.height * 100;
  }

  if (testImage) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setTestImage(null)}
        >
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Image source={{ uri: testImage }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Ajustez la zone de rognage</Text>
        <Text style={styles.subHeaderText}>Déplacez les coins pour redimensionner</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          onLoad={handleImageLoad}
          onLayout={handleImageLayout}
          resizeMode="contain"
        />

        {/* Crop overlay */}
        <View style={styles.cropOverlay}>
          {/* Dark overlay areas */}
          <View style={[styles.overlayArea, { height: `${cropTop}%` }]} />
          <View style={[styles.overlayRow, { height: `${cropHeight}%` }]}>
            <View style={[styles.overlayArea, { width: `${cropLeft}%` }]} />
            <View
              style={[styles.cropArea, { width: `${cropWidth}%`, height: '100%' }]}
              {...cropAreaPanResponder.panHandlers}
            />
            <View style={[styles.overlayArea, { flex: 1 }]} />
          </View>
          <View style={[styles.overlayArea, { flex: 1 }]} />
        </View>

        {/* Top-left handle */}
        <View
          style={[
            styles.cropHandle,
            {
              left: `${cropLeft}%`,
              top: `${cropTop}%`,
              marginLeft: -15,
              marginTop: -15,
            },
          ]}
          {...topLeftPanResponder.panHandlers}
        >
          <View style={styles.handleIndicator} />
        </View>

        {/* Bottom-right handle */}
        <View
          style={[
            styles.cropHandle,
            {
              left: `${cropLeft + cropWidth}%`,
              top: `${cropTop + cropHeight}%`,
              marginLeft: -15,
              marginTop: -15,
            },
          ]}
          {...bottomRightPanResponder.panHandlers}
        >
          <View style={styles.handleIndicator} />
        </View>

        {/* Top-right handle */}
        <View
          style={[
            styles.cropHandle,
            {
              left: `${cropLeft + cropWidth}%`,
              top: `${cropTop}%`,
              marginLeft: -15,
              marginTop: -15,
            },
          ]}
          {...topRightPanResponder.panHandlers}
        >
          <View style={styles.handleIndicator} />
        </View>

        {/* Bottom-left handle */}
        <View
          style={[
            styles.cropHandle,
            {
              left: `${cropLeft}%`,
              top: `${cropTop + cropHeight}%`,
              marginLeft: -15,
              marginTop: -15,
            },
          ]}
          {...bottomLeftPanResponder.panHandlers}
        >
          <View style={styles.handleIndicator} />
        </View>

        {/* Crop border */}
        <View
          style={[
            styles.cropBorder,
            {
              left: `${cropLeft}%`,
              top: `${cropTop}%`,
              width: `${cropWidth}%`,
              height: `${cropHeight}%`,
            },
          ]}
          pointerEvents="none"
        />
      </View>

      {/* Control buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cropButton, isLoading && styles.cropButtonDisabled]}
          onPress={handleCrop}
          disabled={isLoading}
        >
          <Text style={styles.cropButtonText}>
            {isLoading ? 'Rognage...' : 'Rogner'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subHeaderText: {
    color: '#ccc',
    fontSize: 14,
  },
  imageContainer: {
    flex: 1,
    margin: 20,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cropOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayArea: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayRow: {
    flexDirection: 'row',
  },
  cropArea: {
    backgroundColor: 'transparent',
  },
  cropBorder: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderStyle: 'solid',
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  cropHandle: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  handleIndicator: {
    width: 16,
    height: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'black',
  },
  cancelButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cropButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  cropButtonDisabled: {
    opacity: 0.5,
  },
  cropButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SimpleCropper;
