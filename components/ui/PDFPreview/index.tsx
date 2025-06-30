import * as Sharing from 'expo-sharing';
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';

import { COLORS, SIZES } from '../../../constants';

interface PDFPreviewProps {
  uri?: string;
  style?: any;
  height?: number;
  onError?: (error: any) => void;
  onLoad?: () => void;
  documentName?: string;
  documentType?: string;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({
  uri,
  style,
  height,
  onError,
  onLoad,
  documentName,
  documentType,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [error] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Simuler le chargement du document
    if (uri) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onLoad?.();
      }, 500);
    }
  }, [uri, onLoad]);

  const handleOpenPDF = async () => {
    if (!uri) return;

    try {
      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: documentName || 'Ouvrir le document PDF',
          UTI: 'com.adobe.pdf', // iOS UTI for PDF files
        });
      } else {
        // Fallback: on peut aussi utiliser Linking pour ouvrir avec les apps par défaut
        Alert.alert(
          'Ouverture impossible',
          'Impossible d\'ouvrir le document sur cet appareil.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
      Alert.alert(
        'Erreur',
        'Impossible d\'ouvrir le document. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    }
  };

  if (!uri) {
    return (
      <View style={[styles.container, height ? { height } : {}, style]}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Aucun document sélectionné</Text>
          <Text style={styles.placeholderSubtext}>
            Le document apparaîtra ici une fois ajouté
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, height ? { height } : {}, style]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement du document...</Text>
        </View>
      )}

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorSubtext}>
            Impossible d&apos;afficher l&apos;aperçu du document
          </Text>
        </View>
      ) : (
        <View style={styles.pdfContainer}>
          {/* Document header with info */}
          <View style={styles.documentHeader}>
            <View style={styles.documentIcon}>
              <Text style={styles.documentIconText}>PDF</Text>
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentName} numberOfLines={2}>
                {documentName || 'Document PDF'}
              </Text>
              <Text style={styles.documentType}>
                {documentType === 'invoice' ? 'Facture' : documentType === 'ticket' ? 'Ticket' : 'Document PDF'}
              </Text>
            </View>
          </View>

          {/* PDF Preview Area */}
          <TouchableOpacity style={styles.pdfPreviewContainer} onPress={handleOpenPDF}>
            <View style={styles.previewArea}>
              <Text style={styles.previewTitle} numberOfLines={2}>
                {documentName || 'Document PDF'}
              </Text>
              <Text style={styles.previewSubtitle}>
                Appuyer pour ouvrir avec une application externe
              </Text>
              <View style={styles.previewActions}>
                <Text style={styles.previewActionText}>📱 Ouvrir le document</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.greyLighter,
    borderRadius: SIZES.radius.s,
    borderWidth: 1,
    borderColor: COLORS.greyDarker,
  },
  pdf: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding.m,
    minHeight: 120,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: SIZES.font.weight.medium,
    color: COLORS.blueDarker,
    textAlign: 'center',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: COLORS.placeholder,
    textAlign: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding.m,
    minHeight: 120,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.blueDarker,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding.m,
    minHeight: 120,
  },
  errorText: {
    fontSize: 16,
    fontWeight: SIZES.font.weight.medium,
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: COLORS.placeholder,
    textAlign: 'center',
  },
  pdfContainer: {
    backgroundColor: COLORS.light,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding.m,
    backgroundColor: COLORS.greyLighter,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyDarker,
  },
  documentIcon: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius.s,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding.s,
  },
  documentIconText: {
    color: COLORS.light,
    fontSize: 12,
    fontWeight: SIZES.font.weight.semiBold,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: SIZES.font.weight.medium,
    color: COLORS.blueDarker,
    marginBottom: 2,
  },
  documentType: {
    fontSize: 12,
    color: COLORS.placeholder,
    marginBottom: 2,
  },
  shareButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding.s,
    paddingVertical: SIZES.padding.xs,
    borderRadius: SIZES.radius.xs,
  },
  shareButtonText: {
    color: COLORS.light,
    fontSize: 12,
    fontWeight: SIZES.font.weight.medium,
  },
  pdfPreviewContainer: {
    backgroundColor: COLORS.light,
  },
  previewArea: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding.m,
    backgroundColor: COLORS.greyLighter,
    margin: SIZES.padding.xs,
    borderRadius: SIZES.radius.s,
    borderWidth: 2,
    borderColor: COLORS.greyDarker,
    borderStyle: 'dashed',
    minHeight: 100,
  },
  pdfIconLarge: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius.m,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding.m,
    shadowColor: COLORS.blueDarker,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pdfIconLargeText: {
    color: COLORS.light,
    fontSize: 20,
    fontWeight: SIZES.font.weight.semiBold,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: SIZES.font.weight.semiBold,
    color: COLORS.blueDarker,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
    paddingHorizontal: SIZES.padding.s,
  },
  previewSubtitle: {
    fontSize: 14,
    color: COLORS.placeholder,
    textAlign: 'center',
    marginBottom: SIZES.padding.m,
  },
  previewActions: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SIZES.padding.m,
    paddingVertical: SIZES.padding.s,
    borderRadius: SIZES.radius.s,
  },
  previewActionText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: SIZES.font.weight.medium,
    textAlign: 'center',
  },
});

export default PDFPreview;
