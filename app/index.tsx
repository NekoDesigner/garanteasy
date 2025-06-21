import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import Container from '../components/Container';
import ScreenView from '../components/ScreenView';
import SearchBar from '../components/SearchBar';
import Chips from '../components/ui/Chips';
import RoundedIconButton from '../components/ui/RoundedIconButton';
import { COLORS } from '../constants';

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

const HomeScreen = () => {
    return (
      <ScreenView>
        <SearchBar />
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 16 }}>
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
        <Container style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ textAlign: 'center' }}>Veuillez cliquer sur le bouton ci-dessous pour enregistrer votre première garantie en scannant vos documents. Vous pouvez également importer une photo ou un fichier</Text>
        </Container>
        <BottomBar />
      </ScreenView>
    );
};

export default HomeScreen;