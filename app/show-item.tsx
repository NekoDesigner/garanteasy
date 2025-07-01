import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import Container from '../components/Container';
import ScreenView from '../components/ScreenView';
import Button from '../components/ui/Button';
import Chips from '../components/ui/Chips';
import FormCard from '../components/ui/FormCard';
import PDFPreview from '../components/ui/PDFPreview';
import ProductCard from '../components/ui/ProductCard';
import { COLORS, SIZES } from '../constants';
import { useItemRepository } from '../hooks/useItemRepository/useItemRepository';
import { Item } from '../models/Item/Item';
import { useUserContext } from '../providers/UserContext';

const ShowItem = () => {
  const router = useRouter();
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const { user } = useUserContext();
  const { getItemById } = useItemRepository({ ownerId: user?.id ?? '' });
  const [item, setItem] = React.useState<Item | null>(null);

  React.useEffect(() => {
    const fetchItem = async () => {
      if (itemId) {
        const fetchedItem = await getItemById(itemId);
        if (!fetchedItem) {
          return router.dismissAll();
        }
        setItem(fetchedItem);
      }
    };
    fetchItem();
  }, [itemId, getItemById, router]);

  if (!item) {
    return (
      <ScreenView>
        <Container>
          <ActivityIndicator size="large" color={COLORS.blueDarker} />
        </Container>
      </ScreenView>
    );
  }

  return (
    <ScreenView>
      <ScrollView>
        <Container>
          <ProductCard
            brand={item?.brand || 'Unknown Brand'}
            name={item?.label || 'Unknown Item'}
            purchaseDate={item?.purchaseDate || new Date()}
            warrantyDuration={item?.warrantyDuration || 'Aucune garantie'}
            image={item?.picture ? { uri: item.picture } : require('../assets/images/default-product.png')}
            style={styles.space}
          />
          <FormCard style={styles.space}>
            <Text style={styles.h1}>Type de document</Text>
            {item?.warrantyDocument?.type && <Text>{item?.warrantyDocument?.typeLabel}</Text>}
            {item?.warrantyDocument && <PDFPreview
                    uri={item?.warrantyDocument.filePath}
                    style={styles.pdfPreview}
                    documentName={item?.warrantyDocument.name}
                    documentType={item?.warrantyDocument.type}
                    onError={(error: any) => {
                      console.error('PDF Preview Error:', error);
                    }}
                  />}
          </FormCard>
          {item?.otherDocuments && item.otherDocuments.length > 0 && (
            <FormCard style={styles.space}>
              <Text style={styles.h1}>Autres documents</Text>
              {item.otherDocuments.map((doc, index) => (
                <PDFPreview
                  key={index}
                  uri={doc.filePath}
                  style={styles.pdfPreview}
                  documentName={doc.name}
                  documentType={doc.type}
                  onError={(error: any) => {
                    console.error('PDF Preview Error:', error);
                  }}
                />
              ))}
            </FormCard>
          )}
          <FormCard style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', alignItems: 'center' }, styles.space]}>
            <Text style={styles.h1}>Categorie</Text>
            <Chips label={item?.category?.name || ""} category={item?.category?.id || 'other'} showIcon={item?.category?.showIcon()} />
          </FormCard>
          {item?.memo && (
            <FormCard style={styles.space}>
              <Text style={styles.h1}>Note</Text>
              <Text>{item?.memo || 'Aucune note'}</Text>
            </FormCard>
          )}
          <Button
            label="Modifier"
            variant='secondary'
            style={{ paddingVertical: SIZES.padding.s }}
            textStyle={{ textAlign: 'center', flex: 1 }}
            onPress={() => {
              router.push({
                pathname: '/update-item',
                params: { itemId: item.id },
              });
            }}
          />
        </Container>
      </ScrollView>
    </ScreenView>
  );
};

export default ShowItem;

const styles = StyleSheet.create({
  h1: {
    fontSize: SIZES.font.m,
    fontWeight: SIZES.font.weight.semiBold,
  },
  space: {
    marginBottom: SIZES.padding.m,
  },
  pdfPreview: {
    marginBottom: 10,
    borderRadius: SIZES.radius.s,
    overflow: 'hidden',
  },
});