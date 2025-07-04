import { CameraCapturedPicture } from 'expo-camera';
import { ImageResult, SaveFormat, useImageManipulator } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Image, View, ScrollView, Dimensions, TouchableOpacity, Text, Alert, PanResponder, StyleProp, ViewStyle, ActivityIndicator } from 'react-native';
import Container from '../../components/Container';
import AddIcon from '../../components/ui/Icons/AddIcon';
import CropIcon from '../../components/ui/Icons/CropIcon';
import TrashIcon from '../../components/ui/Icons/TrashIcon';
import RoundedIconButton from '../../components/ui/RoundedIconButton';
import { COLORS } from '../../constants';

interface DocumentReviewBottomProps {
  handleAdd?: () => void;
  handleDelete?: () => void;
  handleCrop?: () => void;
}

const DocumentReviewBottom: React.FC<DocumentReviewBottomProps> = ({ handleAdd, handleDelete, handleCrop }) => {
  return (
    <View style={{ height: Dimensions.get('screen').height * 0.17, gap: 40, justifyContent: 'center', alignItems: 'flex-end', flexDirection: 'row', paddingBottom: '15%' }}>
      <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => handleCrop?.()}>
        <CropIcon />
        <Text style={{ color: COLORS.primary, marginTop: 5 }}>Rogner</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => handleAdd?.()}>
        <AddIcon size={20} />
        <Text style={{ color: COLORS.primary, marginTop: 5 }}>Ajouter</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => handleDelete?.()}>
        <TrashIcon />
        <Text style={{ color: COLORS.primary, marginTop: 5 }}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );
};

interface DocumentReviewProps {
  onValidate: (data: (CameraCapturedPicture | ImagePicker.ImagePickerAsset)[]) => void;
  onAdd?: () => void;
  onDelete?: (index: number) => void;
  onCrop?: (imageUri: string, index: number) => void;
  onImageUpdate?: (updatedImages: (CameraCapturedPicture | ImagePicker.ImagePickerAsset)[]) => void;
  style?: StyleProp<ViewStyle>;
  isLoading?: boolean;

  data: (CameraCapturedPicture | ImagePicker.ImagePickerAsset)[];
}

const DocumentReview: React.FC<DocumentReviewProps> = ({ style, data, onValidate, onAdd, onDelete, onCrop, onImageUpdate, isLoading = false }) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showCropper, setShowCropper] = React.useState(false);
  const [images, setImages] = React.useState(data);

  // Cropper state
  const [imageSize, setImageSize] = React.useState({ width: 0, height: 0 });
  const [displayLayout, setDisplayLayout] = React.useState({ width: 0, height: 0 });
  const [, setCropLoading] = React.useState(false);
  const [cropPercentage, setCropPercentage] = React.useState({
    x: 0.25,
      y: 0.25,
      width: 0.5,
      height: 0.5,
  });

  // Helper function to safely get URI from image object
  const getImageUri = (image: CameraCapturedPicture | ImagePicker.ImagePickerAsset): string => {
    if (!image) return '';
    return image.uri || '';
  };

  // Image manipulator for cropping - only initialize if URI exists
  const currentImageUri = React.useMemo(() => {
    return images[currentIndex] ? getImageUri(images[currentIndex]) : '';
  }, [images, currentIndex]);

  const manipulatorContext = useImageManipulator(currentImageUri);

  // Update images when data prop changes
  React.useEffect(() => {
    setImages(data);
    // Ensure currentIndex is within bounds
    if (currentIndex >= data.length) {
      setCurrentIndex(Math.max(0, data.length - 1));
    }
  }, [data, currentIndex]);

  // Reset cropper when changing images
  React.useEffect(() => {
    setCropPercentage({
      x: 0.25,
      y: 0.25,
      width: 0.5,
      height: 0.5,
    });
  }, [currentIndex, showCropper]);

  // Cropper helper functions
  const handleImageLoad = React.useCallback((_event: any) => {
    const { width, height } = images[currentIndex];
    setImageSize({ width, height });
  }, [currentIndex, images]);

  const handleImageLayout = React.useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setDisplayLayout({ width, height });
  }, []);

  const getDisplayedImageDimensions = React.useCallback(() => {
    if (!imageSize.width || !imageSize.height || !displayLayout.width || !displayLayout.height) {
      return { width: 0, height: 0, offsetX: 0, offsetY: 0 };
    }

    const imageAspectRatio = imageSize.width / imageSize.height;
    const containerAspectRatio = displayLayout.width / displayLayout.height;

    let displayedWidth, displayedHeight, offsetX, offsetY;

    if (imageAspectRatio > containerAspectRatio) {
      displayedWidth = displayLayout.width;
      displayedHeight = displayLayout.width / imageAspectRatio;
      offsetX = 0;
      offsetY = (displayLayout.height - displayedHeight) / 2;
    } else {
      displayedWidth = displayLayout.height * imageAspectRatio;
      displayedHeight = displayLayout.height;
      offsetX = (displayLayout.width - displayedWidth) / 2;
      offsetY = 0;
    }

    return { width: displayedWidth, height: displayedHeight, offsetX, offsetY };
  }, [imageSize, displayLayout]);

  const handleCrop = async () => {
    if (!images[currentIndex] || !imageSize.width || !imageSize.height) {
      Alert.alert('Erreur', 'Impossible de charger les dimensions de l\'image');
      return;
    }

    const currentImageUri = getImageUri(images[currentIndex]);
    if (!currentImageUri) {
      Alert.alert('Erreur', 'Image non disponible pour le rognage');
      return;
    }

    setCropLoading(true);
    try {
      const displayed = getDisplayedImageDimensions(); // Donne: { width, height, offsetX, offsetY }

      // 1. Ajuster les pourcentages de crop en fonction de l’image visible centrée
      const adjustedCrop = {
        x: (cropPercentage.x * displayLayout.width - displayed.offsetX) / displayed.width,
        y: (cropPercentage.y * displayLayout.height - displayed.offsetY) / displayed.height,
        width: (cropPercentage.width * displayLayout.width) / displayed.width,
        height: (cropPercentage.height * displayLayout.height) / displayed.height,
      };

      // 2. Calculer les coordonnées réelles dans l’image source
      const actualCrop = {
        originX: Math.round(adjustedCrop.x * imageSize.width),
        originY: Math.round(adjustedCrop.y * imageSize.height),
        width: Math.round(adjustedCrop.width * imageSize.width),
        height: Math.round(adjustedCrop.height * imageSize.height),
      };

      // 3. Appliquer le crop avec expo-image-manipulator
      const croppedImage = await manipulatorContext.crop(actualCrop).renderAsync();

      // 4. Sauvegarder l’image
      const result = await croppedImage.saveAsync({
        compress: 1,
        format: SaveFormat.JPEG,
      });

      // 5. Finaliser
      handleCropComplete(result);

    } catch (error) {
      console.error('Erreur lors du rognage:', error);
      Alert.alert('Erreur', 'Impossible de rogner l\'image');
    } finally {
      setCropLoading(false);
    }
  };

  const handleCropComplete = (cropped: ImageResult) => {
    const updatedImages = [...images];
    updatedImages[currentIndex] = cropped;
    setImages(updatedImages);

    // Notify parent component about the crop completion
    onCrop?.(cropped.uri, currentIndex);
    onImageUpdate?.(updatedImages);

    setShowCropper(false);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
  };

  // Pan responders for crop handles
  const createCornerPanResponder = (corner: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight') => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (evt, gestureState) => {
        if (!displayLayout.width || !displayLayout.height) return;

        const deltaXPercent = gestureState.dx / displayLayout.width;
        const deltaYPercent = gestureState.dy / displayLayout.height;

        setCropPercentage(prev => {
          let newCrop = { ...prev };

          switch (corner) {
            case 'topLeft':
              const newXTL = Math.max(0, Math.min(prev.x + prev.width - 0.1, prev.x + deltaXPercent));
              const newYTL = Math.max(0, Math.min(prev.y + prev.height - 0.1, prev.y + deltaYPercent));
              newCrop = {
                x: newXTL,
                y: newYTL,
                width: prev.width - (newXTL - prev.x),
                height: prev.height - (newYTL - prev.y),
              };
              break;
            case 'topRight':
              const newWidthTR = Math.max(0.1, Math.min(1 - prev.x, prev.width + deltaXPercent));
              const newYTR = Math.max(0, Math.min(prev.y + prev.height - 0.1, prev.y + deltaYPercent));
              newCrop = {
                ...prev,
                y: newYTR,
                width: newWidthTR,
                height: prev.height - (newYTR - prev.y),
              };
              break;
            case 'bottomLeft':
              const newXBL = Math.max(0, Math.min(prev.x + prev.width - 0.1, prev.x + deltaXPercent));
              newCrop = {
                ...prev,
                x: newXBL,
                width: prev.width - (newXBL - prev.x),
                height: Math.max(0.1, Math.min(1 - prev.y, prev.height + deltaYPercent)),
              };
              break;
            case 'bottomRight':
              newCrop = {
                ...prev,
                width: Math.max(0.1, Math.min(1 - prev.x, prev.width + deltaXPercent)),
                height: Math.max(0.1, Math.min(1 - prev.y, prev.height + deltaYPercent)),
              };
              break;
          }

          // Ensure minimum size
          if (newCrop.width >= 0.1 && newCrop.height >= 0.1) {
            return newCrop;
          }
          return prev;
        });
      },
      onPanResponderRelease: () => {},
    });
  };

  const cropAreaPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: (evt, gestureState) => {
      if (!displayLayout.width || !displayLayout.height) return;

      const deltaXPercent = gestureState.dx / displayLayout.width;
      const deltaYPercent = gestureState.dy / displayLayout.height;

      setCropPercentage(prev => {
        const newX = Math.max(0, Math.min(1 - prev.width, prev.x + deltaXPercent));
        const newY = Math.max(0, Math.min(1 - prev.height, prev.y + deltaYPercent));
        return { ...prev, x: newX, y: newY };
      });
    },
    onPanResponderRelease: () => {},
  });

  return (
    <View style={[styles.container, style]}>
      <Container>
        {images.length === 0 ? (
          <View style={{
            height: Dimensions.get('screen').height * 0.49,
            width: '100%',
            marginBottom: 16,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.greyLighter
          }}>
            <Text>Aucune image disponible</Text>
          </View>
        ) : showCropper && images[currentIndex] ? (
          // Integrated Cropper View
            <View style={{ height: Dimensions.get('screen').height * 0.49, position: 'relative' }}>
            <Image
              source={{ uri: getImageUri(images[currentIndex]) }}
              style={{ width: '100%', height: '100%' }}
              onLoad={handleImageLoad}
              onLayout={handleImageLayout}
            />

            {/* Crop overlay */}
            <View style={styles.cropOverlay}>
              {/* Dark overlay areas */}
              <View style={[styles.overlayArea, { height: `${cropPercentage.y * 100}%` }]} />
              <View style={[styles.overlayRow, { height: `${cropPercentage.height * 100}%` }]}>
              <View style={[styles.overlayArea, { width: `${cropPercentage.x * 100}%` }]} />
              <View
                style={[styles.cropArea, { width: `${cropPercentage.width * 100}%`, height: '100%' }]}
                {...cropAreaPanResponder.panHandlers}
              />
              <View style={[styles.overlayArea, { flex: 1 }]} />
              </View>
              <View style={[styles.overlayArea, { flex: 1 }]} />
            </View>

            {/* Crop handles */}
            <View
              style={[styles.cropHandle, {
              left: `${cropPercentage.x * 100}%`,
              top: `${cropPercentage.y * 100}%`,
              marginLeft: -15,
              marginTop: -15,
              }]}
              {...createCornerPanResponder('topLeft').panHandlers}
            >
              <View style={styles.handleIndicator} />
            </View>

            <View
              style={[styles.cropHandle, {
              left: `${(cropPercentage.x + cropPercentage.width) * 100}%`,
              top: `${cropPercentage.y * 100}%`,
              marginLeft: -15,
              marginTop: -15,
              }]}
              {...createCornerPanResponder('topRight').panHandlers}
            >
              <View style={styles.handleIndicator} />
            </View>

            <View
              style={[styles.cropHandle, {
              left: `${cropPercentage.x * 100}%`,
              top: `${(cropPercentage.y + cropPercentage.height) * 100}%`,
              marginLeft: -15,
              marginTop: -15,
              }]}
              {...createCornerPanResponder('bottomLeft').panHandlers}
            >
              <View style={styles.handleIndicator} />
            </View>

            <View
              style={[styles.cropHandle, {
              left: `${(cropPercentage.x + cropPercentage.width) * 100}%`,
              top: `${(cropPercentage.y + cropPercentage.height) * 100}%`,
              marginLeft: -15,
              marginTop: -15,
              }]}
              {...createCornerPanResponder('bottomRight').panHandlers}
            >
              <View style={styles.handleIndicator} />
            </View>

            {/* Crop border */}
            <View
              style={[styles.cropBorder, {
              left: `${cropPercentage.x * 100}%`,
              top: `${cropPercentage.y * 100}%`,
              width: `${cropPercentage.width * 100}%`,
              height: `${cropPercentage.height * 100}%`,
              }]}
              pointerEvents="none"
            />

            {/* Crop controls */}
            <View style={styles.cropControls}>
              <TouchableOpacity
              style={styles.cropCancelButton}
              onPress={handleCropCancel}
              >
              <Text style={styles.cropCancelText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
              style={[styles.cropConfirmButton, isLoading && styles.cropButtonDisabled]}
              onPress={handleCrop}
              disabled={isLoading}
              >
              <Text style={styles.cropConfirmText}>
                {isLoading ? 'Rognage...' : 'Rogner'}
              </Text>
              </TouchableOpacity>
            </View>
            </View>
        ) : images[currentIndex] ? (
          // Normal view
          <Image
            source={{ uri: getImageUri(images[currentIndex]) }}
            style={{
              height: Dimensions.get('screen').height * 0.49,
              width: '100%',
              marginBottom: 16
            }}
            resizeMode="contain"
          />
        ) : (
          <View style={{
            height: Dimensions.get('screen').height * 0.49,
            width: '100%',
            marginBottom: 16,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.greyLighter
          }}>
            <Text>Aucune image disponible</Text>
          </View>
        )}
      </Container>
      <Container>
        {images.length > 0 && (
          <View style={{ backgroundColor: COLORS.greyLighter, borderWidth: 1, borderColor: COLORS.greyDarker, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, borderRadius: 8, marginBottom: 16 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 10 }} style={{ flex: 1 }}>
              {images.map((image, index) => (
                <TouchableOpacity key={index} onPress={() => setCurrentIndex(index)} style={{ borderWidth: currentIndex === index ? 2 : 0, borderColor: COLORS.primary, borderRadius: 2 }}>
                  <Image source={{ uri: getImageUri(image) }} style={{ width: 70, height: 100, margin: 5, borderRadius: 2 }} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <RoundedIconButton icon='arrow-right' onPress={() => onValidate(images)}/>
          </View>
        )}
      </Container>
      <DocumentReviewBottom
        handleAdd={() => onAdd?.()}
        handleCrop={() => {
          if (images[currentIndex] && getImageUri(images[currentIndex])) {
            setShowCropper(true);
          } else {
            Alert.alert('Erreur', 'Aucune image sélectionnée pour le rognage');
          }
        }}
        handleDelete={() => {
          if (images.length === 0) {
            return;
          }

          if (currentIndex === 0 && images.length === 1) {
            Alert.alert(
              'Annuler l\'ajout',
              'Souhaitez-vous vraiment annuler l\'ajout du document ?',
              [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Confirmer', onPress: () => router.dismissAll() }
              ]
            );
            return; // Do not delete if it's the only image
          }
          onDelete?.(currentIndex);
          setImages(prevImages => {
            const updated = [...prevImages];
            updated.splice(currentIndex, 1);
            const newIndex = Math.max(0, currentIndex - (currentIndex === updated.length ? 1 : 0));
            setCurrentIndex(newIndex);
            onImageUpdate?.(updated);
            return updated;
          });
        }}
      />

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.light} />
          <Text style={styles.loadingText}>Traitement en cours...</Text>
        </View>
      )}
    </View>
  );
};

export default DocumentReview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Cropper styles
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
  },
  cropControls: {
    position: 'absolute',
    bottom: 6,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cropCancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.light,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  cropCancelText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cropConfirmButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  cropConfirmText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cropButtonDisabled: {
    opacity: 0.5,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loadingText: {
    color: COLORS.light,
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});