import BottomSheet from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import { MediaType } from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View, ScrollView, FlatList, RefreshControl, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Container from '../components/Container';
import ScreenView from '../components/ScreenView';
import SearchBar from '../components/SearchBar';
import ActionBottomSheet from '../components/ui/ActionBottomSheet';
import CategoryCard from '../components/ui/CategoryCard';
import Chips from '../components/ui/Chips';
import { IChipsProps } from '../components/ui/Chips/@types';
import DynamicIcon from '../components/ui/Icons/DynamicIcon';
import ProductCard from '../components/ui/ProductCard';
import RoundedIconButton from '../components/ui/RoundedIconButton';
import { COLORS } from '../constants';
import { CATEGORIES_BASE, DYNAMIC_CATEGORIES_FILE_NAME } from '../constants/Categories';
import { useDocumentRepository } from '../hooks/useDocumentRepository/useDocumentRepository';
import { useItemRepository } from '../hooks/useItemRepository/useItemRepository';
import { useKeyboardHeight } from '../hooks/useKeyboardHeight/useKeyboardHeight';
import { Document } from '../models/Document/Document';
import { Item } from '../models/Item/Item';
import { useOnboardingContext } from '../providers/OnboardingContext';
import { useUserContext } from '../providers/UserContext';
import * as PDFService from '../services/PDFService';

export function BottomBar() {
  const router = useRouter();
  const { user } = useUserContext();
  const { saveDocument } = useDocumentRepository({ ownerId: user?.id || '' });
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [isImporting, setIsImporting] = React.useState(false);

  const handleUploadPress = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleTakePhoto = () => {
    bottomSheetRef.current?.close();
    router.navigate('/scanner');
  };

  const handleUploadDocument = async () => {
    bottomSheetRef.current?.close();

    try {
      setIsImporting(true);

      // Request permission to access media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Nous avons besoin d\'accéder à votre galerie pour importer des documents.'
        );
        return;
      }

      // Launch image picker with support for images and PDFs
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'] as MediaType[],
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // Create PDF from the selected image
        const pdfOptions = {
          title: asset.fileName ? PDFService.removeFileExtension(asset.fileName) : 'Document Importé',
          author: 'GarantEasy Import',
          subject: 'Document importé depuis la galerie',
          compress: true,
          useTimestamp: true,
        };

        // Create PDF and get file path
        const pdfPath = await PDFService.createPdfFromImages([asset.uri], pdfOptions);
        const fileName = pdfPath.split('/').pop() || 'document.pdf';

        // Create and save the document
        let document = new Document({
          ownerId: user?.id || '',
          name: fileName,
          filename: fileName,
          type: 'invoice', // Type for imported documents
          mimetype: 'application/pdf',
          fileSource: 'local',
          filePath: pdfPath,
        });

        document = await saveDocument(document);

        // Navigate to create-item with the document
        router.push({
          pathname: '/create-item',
          params: { documentId: document.id! },
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'import du document:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de l\'import du document.'
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <>
      <View style={{ height: 80, borderTopWidth: 1, borderColor: COLORS.grey }}>
        <View style={{ position: 'absolute', top: -35, left: '50%', transform: [{ translateX: -40 }] }}>
          <RoundedIconButton icon='upload' onPress={handleUploadPress} size='big' />
        </View>
      </View>

      <ActionBottomSheet
        ref={bottomSheetRef}
        onTakePhoto={handleTakePhoto}
        onUploadDocument={handleUploadDocument}
        onClose={handleCloseBottomSheet}
      />

      {/* Loading Overlay */}
      {isImporting && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary || "#007AFF"} />
            <Text style={styles.loadingText}>Import du document en cours...</Text>
          </View>
        </View>
      )}
    </>
  );
}

const HomeScreen = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const { getAllItems } = useItemRepository({ ownerId: user?.id ?? '' });
  // ‡const [items, setItems] = React.useState<Item[]>([]);
  const [searchedItems, setSearchedItems] = React.useState<Item[]>([]);
  const [categories, setCategories] = React.useState<IChipsProps[]>(CATEGORIES_BASE);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [isCategoriesFilterVisible, setIsCategoriesFilterVisible] = React.useState<boolean>(false);
  const { currentOnboarding, isLoading } = useOnboardingContext();
  const keyboardHeight = useKeyboardHeight();

  const handleShowCategories = (showableItems: Item[]) => {
    // Get all categories from items as unique values and order by number ASC if id ends with a number
    const uniqueCategoriesMap = new Map();
    for (const item of showableItems) {
      if (item.category && item.category.id) {
        uniqueCategoriesMap.set(item.category.id, item.category);
      }
    }
    let uniqueCategories = Array.from(uniqueCategoriesMap.values());

    uniqueCategories = uniqueCategories.sort((a, b) => {
      const getNumber = (id: string) => {
        const match = id.match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
      };
      return getNumber(a.id) - getNumber(b.id);
    });
    const chipsCatgoriesMapped: IChipsProps[] = [];
    for (const category of uniqueCategories) {
      if (!category) continue; // Skip if category is undefined or null
      chipsCatgoriesMapped.push(category.getCategoryChipsProps());
    }
    setCategories(chipsCatgoriesMapped.filter(cat => cat !== undefined) as IChipsProps[]);
  };

  const fetchItems = React.useCallback(async () => {
    try {
      const fetchedItems = await getAllItems({ withArchived: false, withDocuments: true });
      // setItems(fetchedItems);
      setSearchedItems(fetchedItems);
      handleShowCategories(fetchedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }, [getAllItems]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    if (!query) {
      handleSearchBarBlur();
      await fetchItems();
      return;
    }
    const filteredItems = await getAllItems({ withArchived: false, withDocuments: true, byLabelOrBrand: query });
    setSearchedItems(filteredItems);
    handleShowCategories(filteredItems);
    handleSearchBarBlur();
  };

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  React.useEffect(() => {
    if (!isLoading && currentOnboarding && !currentOnboarding.isCompleted) {
      // Use push instead of replace and cast to any to bypass TypeScript route checking
      (router as any).push('/onboarding');
    }
  }, [currentOnboarding, isLoading, router]);

  function handleSearchBarFocus(): void {
    setIsCategoriesFilterVisible(true);
  }

  function handleSearchBarBlur(): void {
    setIsCategoriesFilterVisible(false);
  }

  async function handleFilterByCategory(id: string) {
    console.log('Filtering by category:', id);
    try {
      handleSearchBarBlur();
      const fetchedItems = await getAllItems({ withArchived: false, withDocuments: true, byCategoryIds: [id] });
      // setItems(fetchedItems);
      setSearchedItems(fetchedItems);
      handleShowCategories(fetchedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }

  // console.log(JSON.stringify(items, null, 2));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenView>
        <SearchBar onHandleSearch={handleSearch} onFocus={handleSearchBarFocus} />

        {/** Afficher les CategoryCard pour filtrer */}
        {isCategoriesFilterVisible && (
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              paddingVertical: 16,
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 12,
              justifyContent: 'space-around',
              paddingBottom: keyboardHeight * 1.33 + 16, // Add padding for keyboard
            }}
            style={{}}
          >
            {DYNAMIC_CATEGORIES_FILE_NAME.map(category => (
              <CategoryCard key={category.id} onPress={() => { handleFilterByCategory(category.id); }}>
                <DynamicIcon name={category.fileId} />
                <Text>{category.label}</Text>
              </CategoryCard>
            ))}
          </ScrollView>
        )}

        {!isCategoriesFilterVisible && <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 16, flexGrow: 1 }}
            scrollEventThrottle={16}
          >
            {categories.map((item, index) => (
              <Chips
                key={index}
                label={item.label}
                category={item.category}
                showIcon={item.showIcon}
                style={{ marginRight: 10, marginLeft: index === 0 ? 16 : 0, }}
              />
            ))}
          </ScrollView>
        </View>}

        {searchedItems.length === 0 && !isCategoriesFilterVisible ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            scrollEventThrottle={16}
            bounces={true}
          >
            <Text style={{ textAlign: 'center' }}>
              Veuillez cliquer sur le bouton ci-dessous pour enregistrer votre première garantie en scannant vos documents. Vous pouvez également importer une photo ou un fichier
            </Text>
          </ScrollView>
        ) : (
          !isCategoriesFilterVisible && (
            <FlatList
              style={{ flex: 1 }}
              data={searchedItems}
              keyExtractor={(item) => item.id!}
              renderItem={({ item }) => (
                <Container>
                  <ProductCard
                    brand={item.brand!}
                    name={item.label!}
                    purchaseDate={item.purchaseDate}
                    warrantyDuration={item.warrantyDuration}
                    image={item.picture ? item.picture : require('../assets/images/default-product.png')}
                    style={{ marginTop: 16 }}
                    onPress={() => {
                      router.push({
                        pathname: '/show-item',
                        params: { itemId: item.id },
                    }); }}
                  />
                </Container>
              )}
              contentContainerStyle={{ paddingBottom: 80 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              scrollEventThrottle={16}
              bounces={true}
              showsVerticalScrollIndicator={true}
              removeClippedSubviews={false}
                />
          ))}

        {!isCategoriesFilterVisible && <BottomBar />}
      </ScreenView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default HomeScreen;