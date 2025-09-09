import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Image, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Container from '../components/Container';
import ScreenView from '../components/ScreenView';
import Button from '../components/ui/Button';
import Chips from '../components/ui/Chips';
import FormCard from '../components/ui/FormCard';
import GDateInput from '../components/ui/GDateInput';
import GDropdown from '../components/ui/GDropdown';
import GTextInput from '../components/ui/GTextInput';
import PictureIcon from '../components/ui/Icons/PictureIcon';
import PDFPreview from '../components/ui/PDFPreview';
import RoundedIconButton from '../components/ui/RoundedIconButton';
import { COLORS, SIZES } from '../constants';
import { useCategoryRepository } from '../hooks/useCategoryRepository/useCategoryRepository';
import { useDocumentRepository } from '../hooks/useDocumentRepository/useDocumentRepository';
import { useItemRepository } from '../hooks/useItemRepository/useItemRepository';
import { useUploaderService } from '../hooks/useUploaderService/useUploaderService';
import { Category } from '../models/Category/Category';
import { Document } from '../models/Document/Document';
import { Item } from '../models/Item/Item';
import { useUserContext } from '../providers/UserContext';
import { DateService } from '../services/DateService';
import { ImageService } from '../services/ImageService';

const CreateItem = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const { documentId } = useLocalSearchParams();

  // Use useMemo to stabilize the ownerId to prevent unnecessary re-renders
  const ownerId = React.useMemo(() => user?.id || '', [user?.id]);

  const { saveItem } = useItemRepository({ ownerId });
  const { getDocumentById, deleteDocumentById, attachDocumentToItem } = useDocumentRepository({ ownerId });
  const { getAllCategories } = useCategoryRepository({ ownerId });
  const { handleAddDocument, handleSelectImage, isCreatingDocument } = useUploaderService({ user });

  const [item, setItem] = React.useState<Item>(new Item({
    ownerId,
    label: '',
    purchaseDate: new Date(),
    warrantyDuration: '8y',
    memo: '',
    picture: '',
    brand: '',
    categoryId: '',
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  const [document, setDocument] = React.useState<Document | null>(null);
  const [additionalDocuments, setAdditionalDocuments] = React.useState<Document[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [itemImage, setItemImage] = React.useState<string | null>(null);
  const [category, setCategory] = React.useState<Category | null>(null);
  const [categoriesList, setCategoriesList] = React.useState<Category[]>([]);
  const [warrantyDuration, setWarrantyDuration] = React.useState<string>('');
  const [warrantyDurationType, setWarrantyDurationType] = React.useState<string>('y');

  // Duration options for the dropdown
  const durationOptions = [
    { label: 'Mois', value: 'm' },
    { label: 'Années', value: 'y' },
  ];

  // Function to update warranty duration string
  const updateWarrantyDuration = (duration: string, type: string) => {
    const warrantyDurationString = duration ? `${duration}${type}` : '';
    setItem(prev => new Item({
      ...prev,
      label: prev.label || '',
      memo: prev.memo || '',
      warrantyDuration: warrantyDurationString,
    }));
  };

  // Initialize warranty duration states from initial item value
  React.useEffect(() => {
    const initialDuration = item.warrantyDuration;
    if (initialDuration) {
      // Parse "8y" format
      const match = initialDuration.match(/^(\d+)([my])$/);
      if (match) {
        setWarrantyDuration(match[1]);
        setWarrantyDurationType(match[2]);
      }
    }
  }, [item.warrantyDuration]);

  const handleCategoryPress = (selectedCategory: string) => {
    const selectedCategoryObj = categoriesList.find(cat => cat.id === selectedCategory);
    if (selectedCategoryObj && selectedCategoryObj.id) {
      setCategory(selectedCategoryObj);
      setItem(prev => new Item({
        ...prev,
        label: prev.label || '',
        memo: prev.memo || '',
        categoryId: selectedCategoryObj.id!,
      }));
    } else {
      setCategory(null);
      setItem(prev => new Item({
        ...prev,
        label: prev.label || '',
        memo: prev.memo || '',
        categoryId: '',
      }));
    }
  };

  React.useEffect(() => {
    const loadDocument = async (id: string) => {
      try {
        setLoading(true);
        const doc = await getDocumentById(id);
        setDocument(doc);
      } catch (error) {
        console.error('Error loading document:', error);
      } finally {
        setLoading(false);
      }
    };

    if (documentId && typeof documentId === 'string') {
      loadDocument(documentId);
    }
  }, [documentId, getDocumentById]);

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categories = await getAllCategories();
        setCategoriesList(categories);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [getAllCategories]);

  React.useEffect(() => {
    setLoading(isCreatingDocument);
  }, [isCreatingDocument]);

  const handleSaveItem = async () => {
    try {
      setLoading(true);
      if (!itemImage) {
        Alert.alert('Erreur', 'Veuillez ajouter une image pour l\'article.');
        return;
      }

      // Check if warranty duration is alreay expired
      if (DateService.isItemExpired(
        item.purchaseDate,
        DateService.getWarrantyDurationInDays(item.warrantyDuration)
      )) {
        Alert.alert('Erreur', 'La durée de garantie est déjà expirée. Veuillez vérifier la date d\'achat et la durée de garantie.');
        return;
      }

      // Save the item first
      const savedItem = await saveItem(item);
      setItem(savedItem);

      // Now save the image with the item ID for better organization
      if (itemImage && savedItem.getId()) {
        const finalImageUri = await ImageService.saveItemImage(itemImage, savedItem.getId());

        // Update the item with the final image URI
        const itemWithFinalImage = new Item({
          ...Item.toDto(savedItem),
          picture: finalImageUri,
        });

        // Save the updated item with the final image URI
        const updatedItem = await saveItem(itemWithFinalImage);
        setItem(updatedItem);
        setItemImage(finalImageUri);
      }

      // Attach documents to the item
      for (const document of additionalDocuments) {
        await attachDocumentToItem(document.getId(), savedItem.getId());
      }
      // attach the main document
      if (document) {
        await attachDocumentToItem(document.getId(), savedItem.getId());
      }

      Alert.alert('Succès', 'Article enregistré avec succès!', [
        {
          text: 'OK',
          onPress: () => {
            router.dismissAll();
          }
        }
      ]);
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('Erreur', `Échec de l'enregistrement de l'article: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string, documentName: string) => {
    Alert.alert(
      'Supprimer le document',
      `Êtes-vous sûr de vouloir supprimer "${documentName}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteDocumentById(documentId);
              setAdditionalDocuments((prev) => prev.filter(doc => doc.id !== documentId));
              Alert.alert('Succès', 'Document supprimé avec succès!');
            } catch (error) {
              console.error('Error deleting document:', error);
              Alert.alert('Erreur', `Échec de la suppression du document: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScreenView>
        <ScrollView contentContainerStyle={{ paddingBottom: SIZES.padding.m }}>
          <Container>
            <FormCard style={styles.mainInfoContainer}>
            <TouchableOpacity onPress={() => handleSelectImage(
              (savedImageUri: string | undefined) => {
                if (!savedImageUri) return;
                setItemImage(savedImageUri);
                setItem(prevItem => new Item({
                  ...prevItem,
                  label: prevItem.label ?? '',
                  brand: prevItem.brand ?? '',
                  memo: prevItem.memo ?? '',
                  picture: savedImageUri, // Update item picture with the saved image URI
                }));
                }
              )} style={styles.imageSelector}>
                {itemImage ? (
                  <Image source={{ uri: itemImage }} style={styles.itemImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <PictureIcon size={40} color={COLORS.placeholder} />
                    <Text style={styles.imagePlaceholderText}>Ajouter une photo</Text>
                  </View>
                )}
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
              <GTextInput label="Marque" placeholder='Bosh' onChangeText={(value: string) => {
                setItem(prev => new Item({
                  ...prev,
                  label: prev.label || '',
                  memo: prev.memo || '',
                  brand: value,
                }));
              }} />
              <GTextInput
                label="Objet"
                placeholder='Tondeuse'
                onChangeText={(value: string) => {
                  setItem(prev => new Item({
                    ...prev,
                    label: value,
                    memo: prev.memo || '',
                  }));
                }}
              />
              </View>
            </FormCard>
            <FormCard style={styles.space}>
              <Text style={styles.h1}>Date</Text>
              <GDateInput
                label="Date d'achat" allowFutureDates={false}
                onDateChange={(date: Date) => {
                  setItem(prev => new Item({
                    ...prev,
                    label: prev.label || '',
                    memo: prev.memo || '',
                    purchaseDate: date,
                  }));
                }}
              />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
              <View style={{ flex: 2 }}>
                <GTextInput
                  label="Durée de la garantie"
                  keyboardType='numeric'
                  value={warrantyDuration}
                  onChangeText={(value: string) => {
                    setWarrantyDuration(value);
                    updateWarrantyDuration(value, warrantyDurationType);
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <GDropdown
                  label="Unité"
                  options={durationOptions}
                  selectedValue={warrantyDurationType}
                  onValueChange={(value: string) => {
                    setWarrantyDurationType(value);
                    updateWarrantyDuration(warrantyDuration, value);
                  }}
                />
              </View>
            </View>
            </FormCard>
            <FormCard style={styles.space}>
              <Text style={styles.h1}>Type de document</Text>
            {document && <Text style={styles.label}>Document de garantie : {document.typeLabel}</Text>}

              {/* PDF Preview */}
              {document && (
                <View style={styles.pdfPreviewContainer}>
                  <Text style={styles.pdfPreviewTitle}>Aperçu du document</Text>
                  <PDFPreview
                    uri={document.filePath}
                    style={styles.pdfPreview}
                    documentName={document.name}
                    documentType={document.type}
                    onError={(error) => {
                      console.error('PDF Preview Error:', error);
                    }}
                  />
                </View>
              )}

              {!document && !loading && (
                <View style={styles.noDocumentContainer}>
                  <Text style={styles.noDocumentText}>Aucun document associé</Text>
                  <Text style={styles.noDocumentSubtext}>
                    Vous pouvez ajouter un document en utilisant la section ci-dessous
                  </Text>
                </View>
              )}
            </FormCard>
          <FormCard style={[styles.space]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.h1}>Ajouter un document</Text>
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.blueDarker} />
              ) : (
                  <RoundedIconButton icon='arrow-right' onPress={() => handleAddDocument(
                    async (newDoc: Document) => {
                      // Update the current document state to show the newly created document
                      setAdditionalDocuments((prev) => [...prev, newDoc]);
                    }
                )} />
              )}
            </View>
            {loading && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Enregistrement du document en cours...</Text>
              </View>
            )}
            {additionalDocuments.length > 0 ? (
              <View style={styles.documentsListContainer}>
                <Text style={styles.documentsListTitle}>Documents ajoutés</Text>
                {additionalDocuments.map((doc, index) => (
                  <View key={index} style={styles.documentItem}>
                    <View style={styles.documentIcon}>
                      <PictureIcon size={20} color={COLORS.blueDarker} />
                    </View>
                    <View style={[styles.documentInfo, { flex: 1 }]}>
                      <Text style={styles.documentName} numberOfLines={2} ellipsizeMode="tail">
                        {doc.name}
                      </Text>
                      <Text style={styles.documentType} numberOfLines={1} ellipsizeMode="tail">
                        Type: {doc.typeLabel}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.deleteButton]}
                      onPress={() => doc.id && handleDeleteDocument(doc.id, doc.name)}
                    >
                      <Text style={styles.deleteButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noAdditionalDocuments}>
                <Text style={styles.noAdditionalDocumentsText}>
                  Aucun document supplémentaire ajouté
                </Text>
              </View>
            )}
            </FormCard>
            <FormCard style={styles.space}>
            <Text style={styles.h1}>Catégorie</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {categoriesList.map((chip, index) => {
                const chipsProps = chip.getCategoryChipsProps();
                return (
                  <Chips
                    key={index}
                    label={chip.name}
                    category={chipsProps.category}
                    showIcon={chip.showIcon()}
                    onPress={() => handleCategoryPress(chip.getId())}
                    style={{
                      marginRight: 10,
                      marginBottom: 10,
                      opacity: !category ? 1 : category && category.getId() !== chip.getId() ? 1 : 0.6
                    }}
                  />
                );
              })}
            </View>
            </FormCard>
            <FormCard style={styles.space}>
              <GTextInput
                label="Note"
                onChangeText={(value: string) => {
                  setItem(prev => new Item({
                    ...prev,
                    label: prev.label || '',
                    memo: value,
                  }));
                }}
                value={item.memo}
                labelStyle={[styles.h1, {marginBottom: 10}]}
                placeholder='Informations complémentaires...'
              />
          </FormCard>
          <Button
            style={[styles.space, { paddingVertical: SIZES.padding.s }]}
            textStyle={{ textAlign: 'center', width: '100%' }}
            label='Enregistrer'
            variant='secondary'
            onPress={handleSaveItem}
            disabled={loading || !itemImage || !item.label || !item.purchaseDate || !category || !item.brand}
          />
          </Container>
        </ScrollView>
    </ScreenView>
  );
};

export default CreateItem;

const styles = StyleSheet.create({
  space: {
    marginTop: 10,
  },
  h1: {
    color: COLORS.blueDarker,
    fontSize: 16,
    fontWeight: SIZES.font.weight.semiBold,
  },
  label: {
    marginBottom: 5,
    color: COLORS.placeholder,
    fontSize: 14,
  },
  mainInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageSelector: {
    width: 100,
    height: 100,
    marginRight: 15,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: SIZES.radius.s,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.greyLighter,
    borderRadius: SIZES.radius.s,
    borderWidth: 2,
    borderColor: COLORS.greyDarker,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: COLORS.placeholder,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  pdfPreviewContainer: {
    marginTop: 15,
  },
  pdfPreviewTitle: {
    color: COLORS.blueDarker,
    fontSize: 14,
    fontWeight: SIZES.font.weight.medium,
    marginBottom: 10,
  },
  pdfPreview: {
    marginBottom: 10,
    borderRadius: SIZES.radius.s,
    overflow: 'hidden',
  },
  documentInfo: {
    flex: 1,
    minWidth: 0,
  },
  documentName: {
    color: COLORS.blueDarker,
    fontSize: 13,
    fontWeight: SIZES.font.weight.medium,
    marginBottom: 2,
  },
  documentType: {
    color: COLORS.placeholder,
    fontSize: 11,
  },
  noDocumentContainer: {
    backgroundColor: COLORS.greyLighter,
    padding: SIZES.padding.m,
    borderRadius: SIZES.radius.s,
    marginTop: 15,
    alignItems: 'center',
  },
  noDocumentText: {
    color: COLORS.blueDarker,
    fontSize: 14,
    fontWeight: SIZES.font.weight.medium,
    marginBottom: 4,
  },
  noDocumentSubtext: {
    color: COLORS.placeholder,
    fontSize: 12,
    textAlign: 'center',
  },
  loadingContainer: {
    backgroundColor: COLORS.greyLighter,
    padding: SIZES.padding.s,
    borderRadius: SIZES.radius.s,
    marginTop: 10,
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.blueDarker,
    fontSize: 14,
    fontWeight: SIZES.font.weight.medium,
  },
  documentsListContainer: {
    marginTop: 15,
  },
  documentsListTitle: {
    color: COLORS.blueDarker,
    fontSize: 14,
    fontWeight: SIZES.font.weight.medium,
    marginBottom: 10,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greyLighter,
    padding: SIZES.padding.xs,
    paddingHorizontal: SIZES.padding.s,
    borderRadius: SIZES.radius.s,
    marginBottom: 8,
  },
  documentIcon: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: SIZES.radius.s,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginRight: SIZES.padding.xs,
  },
  noAdditionalDocuments: {
    marginTop: 15,
    padding: SIZES.padding.s,
    backgroundColor: 'rgba(150, 150, 150, 0.05)',
    borderRadius: SIZES.radius.s,
    alignItems: 'center',
  },
  noAdditionalDocumentsText: {
    color: COLORS.placeholder,
    fontSize: 12,
    fontStyle: 'italic',
  },
  deleteButton: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 15,
  },
});