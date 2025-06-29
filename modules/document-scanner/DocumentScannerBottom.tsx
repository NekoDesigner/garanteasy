import React, { useState, useRef } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';
import CloseIcon from '../../components/ui/Icons/CloseIcon';
import PictureIcon from '../../components/ui/Icons/PictureIcon';
import { COLORS } from '../../constants';

const DocumentScannerButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.takePictureButton}>
      <View style={styles.takePictureButtonInner} />
    </TouchableOpacity>
  );
};

interface DocumentScannerBottomProps {
  onTakePicture: () => void;
  onClose?: () => void;
  onImportPicture?: () => void;
  onModeChange?: (mode: 'invoice' | 'ticket') => void;
}

const DocumentScannerBottom: React.FC<DocumentScannerBottomProps> = ({ onTakePicture, onClose, onImportPicture, onModeChange }) => {
  const [activeMode, setActiveMode] = useState<'invoice' | 'ticket'>('ticket');
  const screenWidth = Dimensions.get('window').width;
  const paddingLeftAnim = useRef(new Animated.Value(screenWidth * 0.13)).current; // Start with 15% padding for ticket mode

  const handleModeChange = (mode: 'invoice' | 'ticket') => {
    setActiveMode(mode);
    onModeChange?.(mode);

    // Animate padding based on mode
    const targetPadding = mode === 'invoice' ? screenWidth * 0.38 : screenWidth * 0.13; // Center when invoice, left-aligned when ticket

    Animated.timing(paddingLeftAnim, {
      toValue: targetPadding,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.modeArea, {
        paddingLeft: paddingLeftAnim
      }]}>
        <TouchableOpacity onPress={() => handleModeChange('invoice')}>
          <View style={{ alignItems: 'center' }}>
            <Text style={activeMode === 'invoice' ? styles.modeAreaTextActive : styles.modeAreaText}>Facture</Text>
            {activeMode === 'invoice' && <View style={{position: 'absolute', borderRadius: 999, height: 7, width: 7, backgroundColor: COLORS.primary, bottom: -10}} />}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleModeChange('ticket')}>
          <View style={{ alignItems: 'center' }}>
            <Text style={activeMode === 'ticket' ? styles.modeAreaTextActive : styles.modeAreaText}>Ticket</Text>
            {activeMode === 'ticket' && <View style={{position: 'absolute', borderRadius: 999, height: 7, width: 7, backgroundColor: COLORS.primary, bottom: -10}} />}
          </View>
        </TouchableOpacity>
      </Animated.View>
      <View style={styles.actionArea}>
        <TouchableOpacity onPress={onClose}>
          <CloseIcon size={36} />
        </TouchableOpacity>
        <DocumentScannerButton onPress={onTakePicture} />
        <TouchableOpacity onPress={onImportPicture}>
          <PictureIcon size={36} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DocumentScannerBottom;

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('screen').height * 0.2,
    backgroundColor: COLORS.light
  },
  modeArea: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 50, // Fixed gap instead of percentage for better control
  },
  modeAreaText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  modeAreaTextActive: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  actionArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  takePictureButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 999,
    width: 70,
    height: 70
  },
  takePictureButtonInner: {
    backgroundColor: COLORS.blueDarker,
    width: '100%',
    height: '100%',
    borderRadius: 999,
    shadowColor: COLORS.blueDarker,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});