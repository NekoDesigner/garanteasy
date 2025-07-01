import * as ImagePicker from 'expo-image-picker';
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
import { CATEGORIES_BASE } from '../constants/Categories';
import { useCategoryRepository } from '../hooks/useCategoryRepository/useCategoryRepository';
import { useDocumentRepository } from '../hooks/useDocumentRepository/useDocumentRepository';
import { useItemRepository } from '../hooks/useItemRepository/useItemRepository';
import { Category } from '../models/Category/Category';
import { Document } from '../models/Document/Document';
import { Item } from '../models/Item/Item';
import { useUserContext } from '../providers/UserContext';
import { ImageService } from '../services/ImageService';

const UpdateItem = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const { itemId } = useLocalSearchParams<{ itemId: string }>();

  // Use useMemo to stabilize the ownerId to prevent unnecessary re-renders
  const ownerId = React.useMemo(() => user?.id || '', [user?.id]);

  const { saveItem, getItemById } = useItemRepository({ ownerId });
  const { saveDocument, deleteDocumentById, attachDocumentToItem, detachDocumnentFromItem } = useDocumentRepository({ ownerId });
  const { getAllCategories } = useCategoryRepository({ ownerId });

  const [item, setItem] = React.useState<Item | null>();
  const [document, setDocument] = React.useState<Document | null>(null);
  const [additionalDocuments, setAdditionalDocuments] = React.useState<Document[]>([]);
  const [originalAdditionalDocuments, setOriginalAdditionalDocuments] = React.useState<Document[]>([]);
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

  React.useEffect(() => {
    const loadItem = async (id: string) => {
      try {
        setLoading(true);
        const itemData = await getItemById(id);
        if (itemData) {
          setItem(itemData);
          setItemImage(itemData.picture || null);
          setCategory(categoriesList.find(cat => cat.id === itemData.categoryId) || null);

          // Get warranty doc
          if (!itemData.warrantyDocument) {
            throw Error("L'article n'a pas de document de garantie associé.");
          }
          setDocument(itemData.warrantyDocument);

          // Get additional documents
          if (itemData.otherDocuments) {
            setAdditionalDocuments(itemData.otherDocuments);
            setOriginalAdditionalDocuments(itemData.otherDocuments);
          }

        } else {
          Alert.alert('Erreur', 'Article non trouvé.');
        }
      } catch (error) {
        console.error('Error loading item:', error);
        Alert.alert('Erreur', `Échec du chargement de l'article: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      } finally {
        setLoading(false);
      }
    };

    if (itemId && typeof itemId === 'string') {
      loadItem(itemId);
    }
  }, [itemId, categoriesList, getItemById, ownerId]);

  // Initialize warranty duration states from initial item value
  React.useEffect(() => {
    if (!item || !item.warrantyDuration) return;
    const initialDuration = item.warrantyDuration;
    if (initialDuration) {
      // Parse "8y" format
      const match = initialDuration.match(/^(\d+)([my])$/);
      if (match) {
        setWarrantyDuration(match[1]);
        setWarrantyDurationType(match[2]);
      }
    }
  }, [item]);

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

  if (!item) {
    return (
      <ScreenView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.blueDarker} />
      </ScreenView>
    );
  }

  // Function to update warranty duration string
  const updateWarrantyDuration = (duration: string, type: string) => {

    const warrantyDurationString = duration ? `${duration}${type}` : '';
    setItem(prev => {
      if (!prev) return prev;
      const { purchaseDate, ...rest } = prev;
      const itemData = {
        ...rest,
        label: prev.label || '',
        memo: prev.memo || '',
        warrantyDuration: warrantyDurationString,
        purchaseDate: purchaseDate, // Always include purchaseDate
      };
      return new Item(itemData);
    });
  };

  const handleCategoryPress = (selectedCategory: string) => {
    const selectedCategoryObj = categoriesList.find(cat => cat.name === selectedCategory);
    if (selectedCategoryObj && selectedCategoryObj.id) {
      setCategory(selectedCategoryObj);
      setItem(prev => {
        if (!prev || !prev.purchaseDate) return prev;
        return new Item({
          ...prev,
          label: prev.label || '',
          memo: prev.memo || '',
          categoryId: selectedCategoryObj.id!,
          purchaseDate: prev.purchaseDate, // Ensure purchaseDate is always present
        });
      });
    } else {
      setCategory(null);
      setItem(prev => {
        if (!prev || !prev.purchaseDate) return prev;
        return new Item({
          ...prev,
          label: prev.label || '',
          memo: prev.memo || '',
          categoryId: '',
          purchaseDate: prev.purchaseDate, // Ensure purchaseDate is always present
        });
      });
    }
  };

  const handleSaveItem = async () => {
    try {
      setLoading(true);
      if (!itemImage) {
        Alert.alert('Erreur', 'Veuillez ajouter une image pour l\'article.');
        return;
      }

      // Compare current additionalDocuments with original to determine what to attach/detach
      const documentToAttach: Document[] = additionalDocuments.filter(dc =>
        !originalAdditionalDocuments.find((doc) => doc.getId() === dc.getId())
      );
      const documentToDetach: Document[] = originalAdditionalDocuments.filter(dc =>
        !additionalDocuments.find((doc) => doc.getId() === dc.getId())
      );

      console.log("ORIGIANL ADDITIONAL DOCUMENTS =>", originalAdditionalDocuments);
      console.log("CURRENT ADDITIONAL DOCUMENTS =>", additionalDocuments);
      console.log("DOCUMENT TO ATTACH =>", documentToAttach);
      console.log("DOCUMENT TO DETACH =>", documentToDetach);

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
      for (const doc of documentToAttach) {
        try {
          // Check if document has an ID before attaching
          if (!doc.getId()) {
            console.warn('Document does not have an ID, skipping attach:', doc);
            continue;
          }
          // Only attach the document to the item, don't save it again since it's already saved
          await attachDocumentToItem(doc.getId(), savedItem.getId());
        } catch (attachError) {
          console.error('Error attaching document:', attachError);
          // Continue with other documents even if one fails
        }
      }

      // Detach documents from the item
      for (const doc of documentToDetach) {
        try {
          // Try to delete the image file if it exists
          if (doc.filePath) {
            await ImageService.deleteImage(doc.filePath);
          }
        } catch (imageError) {
          console.warn('Error deleting image file:', imageError);
          // Continue with document deletion even if image deletion fails
        }

        try {
          // Check if document has an ID before detaching
          if (!doc.getId()) {
            console.warn('Document does not have an ID, skipping detach:', doc);
            continue;
          }
          await detachDocumnentFromItem(doc.getId(), savedItem.getId());
          await deleteDocumentById(doc.getId());
        } catch (docError) {
          console.error('Error deleting document:', docError);
          // Continue with other documents even if one fails
        }
      }

      Alert.alert('Succès', 'Article enregistré avec succès!', [
        {
          text: 'OK',
          onPress: () => {
            // Update the original documents list to reflect the current state
            setOriginalAdditionalDocuments([...additionalDocuments]);
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

  const handleSelectImage = async () => {
    try {
      // Demander la permission d'accès à la galerie
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission refusée', 'L\'accès à la galerie est requis pour sélectionner une image.');
        return;
      }

      // Afficher les options pour prendre une photo ou sélectionner depuis la galerie
      Alert.alert(
        'Sélectionner une image',
        'Choisissez une option',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Prendre une photo', onPress: takePhoto },
          { text: 'Choisir depuis la galerie', onPress: pickImage }
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image.');
    }
  };

  const takePhoto = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        Alert.alert('Permission refusée', 'L\'accès à la caméra est requis pour prendre une photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Save image to filesystem and get the URI
        const savedImageUri = await ImageService.saveItemImage(result.assets[0].uri);
        setItemImage(savedImageUri);
        setItem(prevItem => {
          if (!prevItem || !prevItem.purchaseDate) return prevItem;
          return new Item({
            ...prevItem,
            label: prevItem.label ?? '',
            brand: prevItem.brand ?? '',
            memo: prevItem.memo ?? '',
            picture: savedImageUri, // Update item picture with the saved image URI
            purchaseDate: prevItem.purchaseDate, // Ensure purchaseDate is always present and defined
          });
        });
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la prise de photo.');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Save image to filesystem and get the URI
        const savedImageUri = await ImageService.saveItemImage(result.assets[0].uri);
        setItemImage(savedImageUri);
        setItem(prevItem => {
          if (!prevItem || !prevItem.purchaseDate) return prevItem;
          return new Item({
            ...prevItem,
            label: prevItem.label ?? '',
            brand: prevItem.brand ?? '',
            memo: prevItem.memo ?? '',
            picture: savedImageUri, // Update item picture with the saved image URI
            purchaseDate: prevItem.purchaseDate, // Ensure purchaseDate is always present and defined
          });
        });
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image.');
    }
  };

  const handleAddDocument = async () => {
    try {
      // Demander la permission d'accès à la galerie
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission refusée', 'L\'accès à la galerie est requis pour sélectionner un document.');
        return;
      }

      // Afficher les options pour prendre une photo ou sélectionner depuis la galerie
      Alert.alert(
        'Ajouter un document',
        'Choisissez une option',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Prendre une photo', onPress: takeDocumentPhoto },
          { text: 'Choisir depuis la galerie', onPress: pickDocumentFromLibrary }
        ]
      );
    } catch (error) {
      console.error('Erreur lors de l\'ajout de document:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout du document.');
    }
  };

  const takeDocumentPhoto = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        Alert.alert('Permission refusée', 'L\'accès à la caméra est requis pour prendre une photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await createDocumentFromImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la prise de photo.');
    }
  };

  const pickDocumentFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await createDocumentFromImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la sélection de l\'image.');
    }
  };

  const createDocumentFromImage = async (asset: ImagePicker.ImagePickerAsset) => {
    try {
      setLoading(true);

      // Import the PDF service functions
      const { createPdfFromImages, removeFileExtension } = await import('../services/PDFService');

      // Create PDF with appropriate title for 'other' type documents
      const pdfOptions = {
        title: asset.fileName ? removeFileExtension(asset.fileName) : 'Document Supplémentaire',
        author: 'GarantEasy Scanner',
        subject: 'Document ajouté',
        compress: true,
      };

      // Create PDF and get file path
      const pdfPath = await createPdfFromImages([asset.uri], pdfOptions);
      const fileName = pdfPath.split('/').pop() || 'document.pdf';

      // Create and save the document with type 'other'
      let newDocument = new Document({
        ownerId: user?.id || '',
        name: fileName,
        filename: fileName,
        type: 'other', // Type 'other' as requested
        mimetype: 'application/pdf',
        fileSource: 'local',
        filePath: pdfPath,
      });

      newDocument = await saveDocument(newDocument);

      // Update the current document state to show the newly created document
      setAdditionalDocuments((prev) => [...prev, newDocument]);

      Alert.alert('Succès', 'Document ajouté avec succès!');
    } catch (error) {
      console.error('Error creating document:', error);
      Alert.alert('Erreur', `Échec de la création du document: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
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

              // Find the document to get its file path
              const docToDelete = additionalDocuments.find(doc => doc.id === documentId);

              // Remove from UI state immediately for better UX
              setAdditionalDocuments((prev) => prev.filter(doc => doc.id !== documentId));

              // If this is a newly created document (not in originalAdditionalDocuments),
              // we need to actually delete it from the database
              const isNewDocument = !originalAdditionalDocuments.find(doc => doc.getId() === documentId);

              if (isNewDocument && docToDelete) {
                try {
                  // Try to delete the file if it exists
                  if (docToDelete.filePath) {
                    await ImageService.deleteImage(docToDelete.filePath);
                  }
                } catch (imageError) {
                  console.warn('Error deleting image file:', imageError);
                }

                try {
                  // Delete from database
                  await deleteDocumentById(documentId);
                } catch (dbError) {
                  console.error('Error deleting document from database:', dbError);
                  // Re-add to UI if database deletion failed
                  if (docToDelete) {
                    setAdditionalDocuments((prev) => [...prev, docToDelete]);
                  }
                  Alert.alert('Erreur', 'Échec de la suppression du document de la base de données');
                  return;
                }
              } else {
                // For existing documents, we'll handle deletion during save
                // Just removing from UI is sufficient here
              }

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
              <TouchableOpacity onPress={handleSelectImage} style={styles.imageSelector}>
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
              <GTextInput
                label="Marque"
                placeholder='Bosh'
                value={item?.brand}
                onChangeText={(value: string) => {
                  setItem(prev => {
                    if (!prev || !prev.purchaseDate) return prev;
                    return new Item({
                      ...prev,
                      label: prev.label || '',
                      memo: prev.memo || '',
                      brand: value,
                      purchaseDate: prev.purchaseDate, // Ensure purchaseDate is always present
                    });
                  });
                }}
              />
              <GTextInput
                label="Objet"
                placeholder='Tondeuse'
                value={item?.label}
                onChangeText={(value: string) => {
                  setItem(prev => {
                    if (!prev || !prev.purchaseDate) return prev;
                    return new Item({
                      ...prev,
                      label: value,
                      memo: prev.memo || '',
                      purchaseDate: prev.purchaseDate, // Ensure purchaseDate is always present
                    });
                  });
                }}
              />
              </View>
            </FormCard>
            <FormCard style={styles.space}>
              <Text style={styles.h1}>Date</Text>
              <GDateInput
                label="Date d'achat"
                allowFutureDates={false}
                value={item?.purchaseDateFormatted}
                onDateChange={(date: Date) => {
                  setItem(prev => {
                    if (!prev) return prev;
                    return new Item({
                      ...prev,
                      label: prev.label || '',
                      memo: prev.memo || '',
                      purchaseDate: date,
                      warrantyDuration: prev.warrantyDuration ?? '', // Ensure string, not undefined
                    });
                  });
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
                <RoundedIconButton icon='arrow-right' onPress={handleAddDocument} />
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
              {CATEGORIES_BASE.map((chip, index) => (
                  <Chips
                    key={index}
                    label={chip.label}
                    category={chip.category}
                    showIcon={chip.showIcon}
                    onPress={() => handleCategoryPress(chip.label as string)}
                    style={{
                      marginRight: 10,
                      marginBottom: 10,
                      opacity: !category ? 1 : category && category.name !== chip.label ? 1 : 0.6
                    }}
                  />
                ))}
            </View>
            </FormCard>
            <FormCard style={styles.space}>
              <GTextInput
                label="Note"
                onChangeText={(value: string) => {
                  setItem(prev => {
                    if (!prev || !prev.purchaseDate) return prev;
                    return new Item({
                      ...prev,
                      label: prev.label || '',
                      memo: value,
                      purchaseDate: prev.purchaseDate, // Ensure purchaseDate is always present
                    });
                  });
                }}
                value={item.memo}
                labelStyle={[styles.h1, {marginBottom: 10}]}
                placeholder='Informations complémentaires...'
              />
          </FormCard>
          <Button
            style={[styles.space, { paddingVertical: SIZES.padding.s }]}
            textStyle={{ textAlign: 'center', width: '100%' }}
            label='Mettre à jour'
            variant='secondary'
            onPress={handleSaveItem}
            disabled={loading || !itemImage || !item.label || !item.purchaseDate || !category || !item.brand}
          />
          </Container>
        </ScrollView>
    </ScreenView>
  );
};

export default UpdateItem;

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