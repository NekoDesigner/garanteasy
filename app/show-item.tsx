import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, ScrollView, ActivityIndicator, View } from 'react-native';
import Container from '../components/Container';
import ScreenView from '../components/ScreenView';
import Button from '../components/ui/Button';
import Chips from '../components/ui/Chips';
import FormCard from '../components/ui/FormCard';
import PDFPreview from '../components/ui/PDFPreview';
import ProductCard from '../components/ui/ProductCard';
import { COLORS, SIZES } from '../constants';
import { useItemRepository } from '../hooks/useItemRepository/useItemRepository';
import { History } from '../models/History/History';
import { Item } from '../models/Item/Item';
import { useUserContext } from '../providers/UserContext';
import { DateService } from '../services/DateService';

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
        <Container style={{ paddingBottom: SIZES.padding.m }}>
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

          {/** Liste des interventions */}
          {item?.interventions && item.interventions.length > 0 && <FormCard style={styles.space}>
            {item.interventions.map((intervention, index) => (
              <View key={intervention.getId()}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <MaterialIcons name="support-agent" size={24} color="black" />
                  <Text style={styles.h1}>Intervention du {DateService.formatDDMMYYYY(intervention.interventDate)}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                  <Text style={{ fontWeight: '600' }}>Type:</Text>
                  <View style={{ backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                    <Text style={{ fontWeight: '600', color: COLORS.light }}>{History.setLabelToDisplayFormat(intervention.label)}</Text>
                  </View>
                </View>
                {intervention.description && (
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 5, marginBottom: 5 }}>
                    <Text style={{ fontWeight: '600' }}>Description:</Text>
                    <Text>{intervention.description}</Text>
                  </View>
                )}
                {intervention.documents && intervention.documents.length > 0 && (
                  <>
                    <Text style={{ marginVertical: 10, fontWeight: '600' }}>Document{intervention.documents.length > 1 ? 's' : ''} associé{intervention.documents.length > 1 ? 's' : ''}:</Text>
                    {intervention.documents.map((doc, docIndex) => (
                      <PDFPreview
                        key={doc.getId()}
                        uri={doc.filePath}
                        style={styles.pdfPreview}
                        documentName={doc.name}
                        documentType={doc.type}
                        onError={(error: any) => {
                          console.error('PDF Preview Error:', error);
                        }}
                      />
                    ))}
                  </>
                )}
                {index < item.interventions.length - 1 && <View style={{ borderBottomWidth: 1, borderBottomColor: COLORS.greyDarker, marginVertical: 10 }} />}
              </View>
            ))}
          </FormCard>}

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
          <Button
            label="Supprimer le produit"
            variant='outline-secondary'
            style={{ paddingVertical: SIZES.padding.s, marginTop: SIZES.padding.xs }}
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
    fontFamily: SIZES.font.familly.default,
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