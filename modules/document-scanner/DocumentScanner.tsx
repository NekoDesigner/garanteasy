import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';

import Button from '../../components/ui/Button';
import CheckIcon from '../../components/ui/Icons/CheckIcon';
import { COLORS, SIZES } from '../../constants';
import DocumentReview from './DocumentReview';
import DocumentScannedIndicator from './DocumentScannedIndicator';
import DocumentScannerBottom from './DocumentScannerBottom';

export interface DocumentScannerProps {
  onDocumentScanned?: (data: string) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
  onValidation?: (data: string[]) => void;
  style?: object;
}

const DocumentScanner: React.FC<DocumentScannerProps> = ({
  onDocumentScanned,
  onError,
  onClose,
  onValidation,
  style
}) => {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState<string[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [scanMode, setScanMode] = useState<'invoice' | 'ticket'>('ticket');
  const cameraRef = useRef<CameraView>(null);

  const requestCameraPermission = React.useCallback(async () => {
    try {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Camera permission is required to take photos');
        return false;
      }
      return true;
    } catch (error) {
      onError?.(error as Error);
      return false;
    }
  }, [requestPermission, onError]);

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      if (photo?.uri) {
        console.log('Taking picture in mode:', scanMode);
        setPhotos((prev) => [...prev, photo.uri]);
        onDocumentScanned?.(photo.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      onError?.(error as Error);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Gallery access permission is required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotos((prev) => [...prev, result.assets[0].uri]);
        onDocumentScanned?.(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      onError?.(error as Error);
    }
  };

  const closeCamera = () => {
    router.back();
    onClose?.();
  };

  const reviewPhotos = () => {
    setShowReview(true);
    router.setParams({ reviewMode: 'true' });
  };

  const validatePhotos = () => {
    if (photos.length > 0) {
      // Remove the review parameter when validation is complete
      router.setParams({ reviewMode: undefined });
      onValidation?.(photos);
    }
  };

  const handleModeChange = (mode: 'invoice' | 'ticket') => {
    setScanMode(mode);
    console.log('Scan mode changed to:', mode);
  };

  React.useEffect(() => {
    const checkPermissions = async () => {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('Camera permission is required to use the document scanner');
        router.dismissAll();
      }
    };
    checkPermissions();
  }, [requestCameraPermission, router]);

  if (!permission) {
    return (
      <View style={[styles.container, style]}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button
          label="Grant Permission"
          onPress={requestPermission}
          variant="primary"
          size="s"
        />
      </View>
    );
  }

  return showReview ? <DocumentReview
    onValidate={validatePhotos}
    onAdd={() => {
      setShowReview(false);
      // Remove the review parameter when going back to camera view
      router.setParams({ reviewMode: undefined });
    }}
    onDelete={(index) => setPhotos((prev) => prev.filter((_, i) => i !== index))}
    data={photos}
  /> : (
    <View style={[styles.container, style]}>
        <View style={[styles.container, style]}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            >
              {photos.length > 0 && <DocumentScannedIndicator count={photos.length} />}
              {photos.length > 0 && <TouchableOpacity onPress={reviewPhotos} style={styles.validatePhotosButton}>
                <CheckIcon />
              </TouchableOpacity>}
          </CameraView>
          <DocumentScannerBottom onTakePicture={takePicture} onClose={closeCamera} onImportPicture={pickImageFromGallery} onModeChange={handleModeChange} />
        </View>
    </View>
  );
};

export default DocumentScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  camera: {
    flex: 1,
  },
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  photo: {
    width: '100%',
    height: '70%',
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
  },
  validatePhotosButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: COLORS.emerald,
    borderRadius: SIZES.radius.full,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  }
});