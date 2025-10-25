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

const BASE_LEFT_MARGIN = 30;

const DocumentScannerBottom: React.FC<DocumentScannerBottomProps> = ({ onTakePicture, onClose, onImportPicture, onModeChange }) => {
  const [activeMode, setActiveMode] = useState<'invoice' | 'ticket'>('ticket');
  const [factureTextWidth, setFactureTextWidth] = useState(60); // Valeur par défaut
  const [ticketTextWidth, setTicketTextWidth] = useState(45);   // Valeur par défaut
  const [textMeasured, setTextMeasured] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  // Callbacks pour mesurer les tailles des textes
  const onFactureTextLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setFactureTextWidth(width);
    checkIfAllTextsMeasured();
  };

  const onTicketTextLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setTicketTextWidth(width);
    checkIfAllTextsMeasured();
  };

  const checkIfAllTextsMeasured = () => {
    // Une fois que les deux textes sont mesurés, on peut initialiser les animations
    if (!textMeasured) {
      setTextMeasured(true);
    }
  };

  // Calculs pour les positions par défaut (Ticket mode)
  const defaultFactureMargin = BASE_LEFT_MARGIN;
  const defaultTicketMargin = (screenWidth - ticketTextWidth - BASE_LEFT_MARGIN + 7) / 2; // Centrer "Ticket"

  // Animations pour les marges de chaque texte
  const factureMarginAnim = useRef(new Animated.Value(defaultFactureMargin)).current;
  const ticketMarginAnim = useRef(new Animated.Value(defaultTicketMargin)).current;

  const handleModeChange = (mode: 'invoice' | 'ticket') => {
    setActiveMode(mode);
    onModeChange?.(mode);

    // Calculer les positions avec les vraies tailles de texte
    // Pour centrer "Facture": on prend le centre de l'écran moins la moitié de la largeur du texte
    const centeredFactureMargin = (screenWidth - factureTextWidth - BASE_LEFT_MARGIN) / 2;
    const rightTicketMargin = screenWidth - ticketTextWidth - BASE_LEFT_MARGIN;
    const newDefaultTicketMargin = (screenWidth - ticketTextWidth - BASE_LEFT_MARGIN + 7) / 2;

    if (mode === 'invoice') {
      // Centrer "Facture" et déplacer "Ticket" à droite
      Animated.parallel([
        Animated.timing(factureMarginAnim, {
          toValue: centeredFactureMargin,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(ticketMarginAnim, {
          toValue: rightTicketMargin,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        })
      ]).start();
    } else {
      console.log('Reverting to ticket mode positions');
      // Position par défaut: "Facture" à gauche, "Ticket" au centre
      Animated.parallel([
        Animated.timing(factureMarginAnim, {
          toValue: defaultFactureMargin,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(ticketMarginAnim, {
          toValue: newDefaultTicketMargin,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        })
      ]).start();
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.modeArea}>
        <Animated.View style={[styles.modeItem, { marginLeft: factureMarginAnim }]}>
          <TouchableOpacity onPress={() => handleModeChange('invoice')}>
            <View style={{ alignItems: 'center' }}>
              <Text
                style={activeMode === 'invoice' ? styles.modeAreaTextActive : styles.modeAreaText}
                onLayout={onFactureTextLayout}
              >
                Facture
              </Text>
              {activeMode === 'invoice' && <View style={styles.activeIndicator} />}
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.modeItem, { marginLeft: ticketMarginAnim }]}>
          <TouchableOpacity onPress={() => handleModeChange('ticket')}>
            <View style={{ alignItems: 'center' }}>
              <Text
                style={activeMode === 'ticket' ? styles.modeAreaTextActive : styles.modeAreaText}
                onLayout={onTicketTextLayout}
              >
                Ticket
              </Text>
              {activeMode === 'ticket' && <View style={styles.activeIndicator} />}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

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
    position: 'relative',
    height: 60,
    paddingVertical: 15,
  },
  modeItem: {
    position: 'absolute',
    top: 15,
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
  activeIndicator: {
    position: 'absolute',
    borderRadius: 999,
    height: 7,
    width: 7,
    backgroundColor: COLORS.primary,
    bottom: -10
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