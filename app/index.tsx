import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View, ScrollView, FlatList, RefreshControl } from 'react-native';
import Container from '../components/Container';
import ScreenView from '../components/ScreenView';
import SearchBar from '../components/SearchBar';
import Chips from '../components/ui/Chips';
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
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchItems = React.useCallback(async () => {
    try {
      const fetchedItems = await getAllItems({ withArchived: false, withDocuments: true });
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }, [getAllItems]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

    return (
      <ScreenView>
        <SearchBar />
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 16, flexGrow: 1 }} >
            {CATEGORIES_BASE.map((item, index) => (
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
        <Container style={{
          flex: 1,
          justifyContent: items.length ? 'flex-start' : 'center',
          alignItems: items.length ? 'flex-start' : 'center',
        }}>
          {items.length === 0 && (
            <ScrollView
              contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            >
              <Text style={{ textAlign: 'center', paddingHorizontal: 20 }}>
                Veuillez cliquer sur le bouton ci-dessous pour enregistrer votre première garantie en scannant vos documents. Vous pouvez également importer une photo ou un fichier
              </Text>
            </ScrollView>
          )}
          {items.length > 0 && <FlatList
            style={{ flex: 1, width: '100%' }} // Ensure it takes up available space
            data={items}
            keyExtractor={(item) => item.id!}
            renderItem={({ item }) => (
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
                }); }} // Navigate to item details
              />
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
            nestedScrollEnabled={true} // Allow nested scrolling
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />}
        </Container>
        <BottomBar />
      </ScreenView>
    );
};

export default HomeScreen;