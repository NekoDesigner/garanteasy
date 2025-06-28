import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Image, View, ScrollView, Dimensions, TouchableOpacity, Text, Alert } from 'react-native';
import Container from '../../components/Container';
import AddIcon from '../../components/ui/Icons/AddIcon';
import CropIcon from '../../components/ui/Icons/CropIcon';
import TrashIcon from '../../components/ui/Icons/TrashIcon';
import RoundedIconButton from '../../components/ui/RoundedIconButton';
import { COLORS } from '../../constants';

interface DocumentReviewBottomProps {
  handleAdd?: () => void;
  handleDelete?: () => void;
  handleCrop?: () => void;
}

const DocumentReviewBottom: React.FC<DocumentReviewBottomProps> = ({ handleAdd, handleDelete, handleCrop }) => {
  return (
    <View style={{ height: Dimensions.get('screen').height * 0.17, gap: 40, justifyContent: 'center', alignItems: 'flex-end', flexDirection: 'row', paddingBottom: '15%' }}>
      <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => handleCrop?.()}>
        <CropIcon />
        <Text style={{ color: COLORS.primary, marginTop: 5 }}>Rogner</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => handleAdd?.()}>
        <AddIcon size={20} />
        <Text style={{ color: COLORS.primary, marginTop: 5 }}>Ajouter</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => handleDelete?.()}>
        <TrashIcon />
        <Text style={{ color: COLORS.primary, marginTop: 5 }}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );
};

interface DocumentReviewProps {
  onValidate: (data: string[]) => void;
  onAdd?: () => void;
  onDelete?: (index: number) => void;
  onCrop?: () => void;
  style?: object;
  data: string[];
}

const DocumentReview: React.FC<DocumentReviewProps> = ({ style, data, onValidate, onAdd, onDelete }) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  return (
    <View style={[styles.container, style]}>
      <Container>
          <Image source={{ uri: data[currentIndex] }} style={{ height: Dimensions.get('screen').height * 0.49, width: 'auto', marginBottom: 16 }} />
      </Container>
      <Container>
        <View style={{ backgroundColor: COLORS.greyLighter, borderWidth: 1, borderColor: COLORS.greyDarker, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, borderRadius: 8, marginBottom: 16 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 10 }} style={{ flex: 1 }}>
            {data.map((uri, index) => (
              <TouchableOpacity key={index} onPress={() => setCurrentIndex(index)} style={{ borderWidth: currentIndex === index ? 2 : 0, borderColor: COLORS.primary, borderRadius: 2 }}>
                <Image source={{ uri }} style={{ width: 70, height: 100, margin: 5, borderRadius: 2 }} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <RoundedIconButton icon='arrow-right' onPress={() => onValidate(data)}/>
        </View>
      </Container>
      <DocumentReviewBottom
        handleAdd={() => onAdd?.()}
        handleDelete={() => {
          if (currentIndex === 0 && data.length === 1) {
            Alert.alert(
              'Annuler l\'ajout',
              'Souhaitez-vous vraiment annuler l\'ajout du document ?',
              [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Confirmer', onPress: () => router.dismissAll() }
              ]
            );
            return; // Do not delete if it's the only image
          }
          onDelete?.(currentIndex);
          setCurrentIndex(0);
        }}
      />
    </View>
  );
};

export default DocumentReview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});