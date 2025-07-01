import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo, useState, useImperativeHandle } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../constants';
import Button from '../Button';

interface ActionBottomSheetProps {
  onTakePhoto: () => void;
  onUploadDocument: () => void;
  onClose: () => void;
}

const ActionBottomSheet = forwardRef<BottomSheet, ActionBottomSheetProps>(
  ({ onTakePhoto, onUploadDocument, onClose }, ref) => {
    // Variables - Hauteur fixe pour un meilleur contrôle
    const snapPoints = useMemo(() => ['400'], []);
    const [isVisible, setIsVisible] = useState(false);
    const bottomSheetRef = React.useRef<BottomSheet>(null);

    // Callbacks
    const handleSheetChanges = useCallback((index: number) => {
      if (index === -1) {
        setIsVisible(false);
        onClose();
      }
    }, [onClose]);

    // Render backdrop component
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          onPress={() => bottomSheetRef.current?.close()}
        />
      ),
      []
    );

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      snapToIndex: (index: number) => {
        setIsVisible(true);
        setTimeout(() => {
          bottomSheetRef.current?.snapToIndex(index);
        }, 0);
      },
      close: () => {
        bottomSheetRef.current?.close();
      },
      snapToPosition: (position: string | number) => {
        bottomSheetRef.current?.snapToPosition(position);
      },
      expand: () => {
        bottomSheetRef.current?.expand();
      },
      collapse: () => {
        bottomSheetRef.current?.collapse();
      },
      forceClose: () => {
        bottomSheetRef.current?.forceClose();
      },
    }), []);

    // Don't render if not visible
    if (!isVisible) {
      return null;
    }

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        android_keyboardInputMode="adjustResize"
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.title}>
            Quel type de garantie souhaitez-vous ajouter ?
          </Text>

          <Button
            label='Prendre une photo'
            variant='primary'
            style={{ marginBottom: 12 }}
            textStyle={styles.actionButtonText}
            onPress={onTakePhoto}
          />

          <Button
            label='Charger un document'
            variant='primary'
            textStyle={styles.actionButtonText}
            onPress={onUploadDocument}
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: COLORS.light,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  handleIndicator: {
    backgroundColor: COLORS.grey,
    width: 40,
    height: 4,
  },
  contentContainer: {
    height: 280,
    paddingHorizontal: SIZES.padding.m,
    paddingTop: SIZES.padding.m,
    paddingBottom: SIZES.padding.m,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    color: COLORS.blueDarker,
    lineHeight: 24,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.light,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  closeButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: '500',
  },
});

ActionBottomSheet.displayName = 'ActionBottomSheet';

export default ActionBottomSheet;
