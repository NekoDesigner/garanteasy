import React from 'react';
import { Text, View, ScrollView, FlatList } from 'react-native';
import Container from '../components/Container';
import ScreenView from '../components/ScreenView';
import SearchBar from '../components/SearchBar';
import Chips from '../components/ui/Chips';
import ProductCard from '../components/ui/ProductCard';
import RoundedIconButton from '../components/ui/RoundedIconButton';
import { COLORS } from '../constants';
import { Item } from '../models/Item/Item';
import { useUserContext } from '../providers/UserContext';

const CATEGORIES = [
  {
    label: 'Jardin',
    category: 'garden',
  },
  {
    label: 'Mode',
    category: 'fashion',
  },
  {
    label: 'Multimédia',
    category: 'multimedia',
  },
  {
    label: 'Bricolage',
    category: 'diy',
  },
  {
    label: 'Autres',
    category: 'other',
  }
];

export function BottomBar() {
  return (
    <View style={{ height: 80, borderTopWidth: 1, borderColor: COLORS.grey }}>
      <View style={{ position: 'absolute', top: -35, left: '50%', transform: [{ translateX: -40 }] }}>
        <RoundedIconButton icon='upload' onPress={() => {}} size='big' />
      </View>
    </View>
  );
}

const ITEMS: Item[] = [
  new Item({
    id: '1',
    label: 'Tondeuse à gazon',
    memo: 'Bosh',
    purchaseDate: new Date('2023-10-01'),
    warrantyDuration: '15d',
    picture: require('../assets/images/tondeuse-test.png'),
    isArchived: false,
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-10-01'),
    ownerId: 'user-1',
    categoryId: 'garden',
  }),
  new Item({
    id: '2',
    label: 'Tondeuse à gazon',
    memo: 'Bosh',
    purchaseDate: new Date('2023-10-01'),
    warrantyDuration: '15d',
    picture: require('../assets/images/tondeuse-test.png'),
    isArchived: false,
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-10-01'),
    ownerId: 'user-1',
    categoryId: 'garden',
  }),
  new Item({
    id: '3',
    label: 'Tondeuse à gazon',
    memo: 'Bosh',
    purchaseDate: new Date('2023-10-01'),
    warrantyDuration: '15d',
    picture: require('../assets/images/tondeuse-test.png'),
    isArchived: false,
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-10-01'),
    ownerId: 'user-1',
    categoryId: 'garden',
  }),
  new Item({
    id: '4',
    label: 'Tondeuse à gazon',
    memo: 'Bosh',
    purchaseDate: new Date('2023-10-01'),
    warrantyDuration: '15d',
    picture: require('../assets/images/tondeuse-test.png'),
    isArchived: false,
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-10-01'),
    ownerId: 'user-1',
    categoryId: 'garden',
  }),
  new Item({
    id: '5',
    label: 'Tondeuse à gazon',
    memo: 'Bosh',
    purchaseDate: new Date('2023-10-01'),
    warrantyDuration: '15d',
    picture: require('../assets/images/tondeuse-test.png'),
    isArchived: false,
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-10-01'),
    ownerId: 'user-1',
    categoryId: 'garden',
  }),
  new Item({
    id: '6',
    label: 'Tondeuse à gazon',
    memo: 'Bosh',
    purchaseDate: new Date('2023-10-01'),
    warrantyDuration: '15d',
    picture: require('../assets/images/tondeuse-test.png'),
    isArchived: false,
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-10-01'),
    ownerId: 'user-1',
    categoryId: 'garden',
  })
];

const HomeScreen = () => {
    useUserContext();

    return (
      <ScreenView>
        <SearchBar />
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 16, flexGrow: 1 }} >
            {CATEGORIES.map((item, index) => (
              <Chips
                key={index}
                label={item.label}
                category={item.category}
                showIcon
                style={{ marginRight: 10, marginLeft: index === 0 ? 16 : 0, }}
              />
            ))}
          </ScrollView>
        </View>
        <Container style={{
          flex: 1,
          justifyContent: ITEMS.length ? 'flex-start' : 'center',
          alignItems: ITEMS.length ? 'flex-start' : 'center'
        }}>
          {ITEMS.length === 0 && <Text style={{ textAlign: 'center' }}>Veuillez cliquer sur le bouton ci-dessous pour enregistrer votre première garantie en scannant vos documents. Vous pouvez également importer une photo ou un fichier</Text>}
          <FlatList
            style={{ flex: 1, width: '100%' }} // Ensure it takes up available space
            data={ITEMS}
            keyExtractor={(item) => item.id!}
            renderItem={({ item }) => (
              <ProductCard
                brand={item.memo!}
                name={item.label!}
                purchaseDate={item.purchaseDate}
                warrantyDuration={item.warrantyDuration}
                image={item.picture ? item.picture : require('../assets/images/default-product.png')}
                style={{ marginTop: 16 }}
              />
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
            nestedScrollEnabled={true} // Allow nested scrolling
          />
          {/* {ITEMS.map((item) => (
            <ProductCard
              brand={item.memo!}
              name={item.label!}
              purchaseDate={item.purchaseDate}
              warrantyDuration={item.warrantyDuration}
              image={item.picture ? item.picture : require('../assets/images/default-product.png')}
              key={item.id}
              testID={`product-card-${item.id}`}
              style={{ marginTop: 16, width: '100%', maxWidth: 'auto' }}
            />
          ))} */}
        </Container>
        <BottomBar />
      </ScreenView>
    );
};

export default HomeScreen;