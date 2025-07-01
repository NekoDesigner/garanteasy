import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View, ScrollView, FlatList, RefreshControl } from 'react-native';
import Container from '../components/Container';
import ScreenView from '../components/ScreenView';
import SearchBar from '../components/SearchBar';
import Chips from '../components/ui/Chips';
import { IChipsProps } from '../components/ui/Chips/@types';
import ProductCard from '../components/ui/ProductCard';
import RoundedIconButton from '../components/ui/RoundedIconButton';
import { COLORS } from '../constants';
import { CATEGORIES_BASE } from '../constants/Categories';
import { useItemRepository } from '../hooks/useItemRepository/useItemRepository';
import { Item } from '../models/Item/Item';
import { useUserContext } from '../providers/UserContext';
// import { useUserContext } from '../providers/UserContext';

export function BottomBar() {
  const router = useRouter();
  return (
    <View style={{ height: 80, borderTopWidth: 1, borderColor: COLORS.grey }}>
      <View style={{ position: 'absolute', top: -35, left: '50%', transform: [{ translateX: -40 }] }}>
        <RoundedIconButton icon='upload' onPress={() => { router.navigate('/scanner'); }} size='big' />
      </View>
    </View>
  );
}

const HomeScreen = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const { getAllItems } = useItemRepository({ ownerId: user?.id ?? '' });
  const [items, setItems] = React.useState<Item[]>([]);
  const [searchedItems, setSearchedItems] = React.useState<Item[]>([]);
  const [categories, setCategories] = React.useState<IChipsProps[]>(CATEGORIES_BASE);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchItems = React.useCallback(async () => {
    try {
      const fetchedItems = await getAllItems({ withArchived: false, withDocuments: true });
      setItems(fetchedItems);
      setSearchedItems(fetchedItems);

      // Get all categories from items as unique values and order by number ASC if id ends with a number
      const uniqueCategoriesMap = new Map();
      for (const item of fetchedItems) {
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
      console.log('Unique Categories:', uniqueCategories);
      const chipsCatgoriesMapped: IChipsProps[] = [];
      for (const category of uniqueCategories) {
        if (!category) continue; // Skip if category is undefined or null
        chipsCatgoriesMapped.push(category.getCategoryChipsProps());
      }
      setCategories(chipsCatgoriesMapped.filter(cat => cat !== undefined) as IChipsProps[]);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }, [getAllItems]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setSearchedItems(items);
      return;
    }
    const filteredItems = items.filter(item =>
      item.label?.toLowerCase().includes(query.toLowerCase()) ||
      item.brand?.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedItems(filteredItems);
  };

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

    return (
      <ScreenView>
        <SearchBar onHandleSearch={handleSearch} />
        <View>
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
        </View>

        {searchedItems.length === 0 ? (
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
        )}

        <BottomBar />
      </ScreenView>
    );
};

export default HomeScreen;