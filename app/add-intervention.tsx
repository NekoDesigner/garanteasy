import { useRouter, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Container from '../components/Container';
import ScreenView from '../components/ScreenView';
import Button from '../components/ui/Button';
import FormCard from '../components/ui/FormCard';
import GDateInput from '../components/ui/GDateInput';
import GTextInput from '../components/ui/GTextInput';
import InterventionDropdown, { INTERVENTION_OPTIONS } from '../components/ui/InterventionDropdown';
import PDFPreview from '../components/ui/PDFPreview';
import ProductCard from '../components/ui/ProductCard';
import RoundedIconButton from '../components/ui/RoundedIconButton';
import { COLORS, SIZES } from '../constants';
import { useDocumentRepository } from '../hooks/useDocumentRepository/useDocumentRepository';
import { useHistoryRepository } from '../hooks/useHistoryRepository/useHistoryRepository';
import { useItemRepository } from '../hooks/useItemRepository/useItemRepository';
import { useUploaderService } from '../hooks/useUploaderService/useUploaderService';
import { Document } from '../models/Document/Document';
import { History, HistoryLabel } from '../models/History/History';
import { Item } from '../models/Item/Item';
import { useUserContext } from '../providers/UserContext';
import { DateService } from '../services/DateService';

const AddIntervention = () => {
  const router = useRouter();
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const { user } = useUserContext();
  const { getItemById } = useItemRepository({ ownerId: user?.id ?? '' });
  const { handleAddDocument, isCreatingDocument, setUploaderDocumentType } = useUploaderService({ user });
  const { saveHistoryInterventionFromItem } = useHistoryRepository({ ownerId: user?.id || '' });
  const { saveAndAttachDocumentToHistoryIntervention } = useDocumentRepository({ ownerId: user?.id || '' });
  const [item, setItem] = React.useState<Item>(new Item({
      ownerId: user?.id ?? '',
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
  const [historyIntervention, setHistoryIntervention] = React.useState<History>(new History({
    description: '',
    interventDate: new Date(),
    ItemId: itemId || '',
    label: History.setLabelToDatabaseFormat(INTERVENTION_OPTIONS[0]),
  }));
  const [document, setDocument] = React.useState<Document | null>(null);

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
    setUploaderDocumentType('intervention');
      fetchItem();
  }, [itemId, getItemById, router, setUploaderDocumentType]);

  const handleSaveHistoryIntervention = React.useCallback(async () => {
    try {
      const createdHistoryIntervention = await saveHistoryInterventionFromItem(historyIntervention, item);
      if (document) {
        await saveAndAttachDocumentToHistoryIntervention(document!, createdHistoryIntervention.getId());
      }
      setUploaderDocumentType('other');
      router.replace({
        pathname: '/show-item',
        params: { itemId: item.id },
      });
    } catch (error) {
      console.error('Error saving history intervention:', error);
      Alert.alert(
        'Erreur',
        "Une erreur est survenue lors de l'enregistrement de l'intervention. Veuillez contacter le support si le problème persiste."
      );
    }
  }, [document, historyIntervention, item, router, saveAndAttachDocumentToHistoryIntervention, saveHistoryInterventionFromItem, setUploaderDocumentType]);

  if (!item) {
    return (
      <ScreenView>
        <Container>
          <ActivityIndicator size="large" color={COLORS.blueDarker} />
        </Container>
      </ScreenView>
    );
  }

  React.useEffect(() => {}, [historyIntervention])

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
            <Text style={styles.h1}>Date</Text>
            <GDateInput
              label="Date d'intervention" allowFutureDates={false}
              value={DateService.formatDDMMYYYY(historyIntervention.interventDate)}
              onDateChange={(date: Date) => {
                setHistoryIntervention(prev => {
                  prev.interventDate = date;
                  return prev;
                });
              }}
            />
          </FormCard>

          <FormCard style={styles.space}>
            <Text style={styles.h1}>Type d&apos;intervention</Text>
            <InterventionDropdown
              onValueChange={(value: HistoryLabel) => {
                setHistoryIntervention(prev => new History({
                  ...prev,
                  label: value,
                }));
              
              }}
            />
          </FormCard>

          <FormCard style={styles.space}>
            <GTextInput
                  label="Description de l&apos;intervention"
                  onChangeText={(value: string) => {
                    setHistoryIntervention(prev => new History({
                      ...prev,
                      description: value,
                    }));
                  }}
                  value={historyIntervention.description}
                  labelStyle={[styles.h1, { marginBottom: 10 }]}
                />
          </FormCard>

          <FormCard style={[styles.space]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.h1}>Ajouter un document</Text>
              {isCreatingDocument && <ActivityIndicator animating={isCreatingDocument} />}
              {!isCreatingDocument && <RoundedIconButton
                icon='scan'
                onPress={() => {
                handleAddDocument((newDocument: Document) => {
                  setDocument(newDocument);
                });
                }} />}
            </View>
            {document && <Text style={{
              marginBottom: 5,
              color: COLORS.placeholder,
              fontSize: 14,
            }}>Document de garantie : {document.typeLabel}</Text>}

              {/* PDF Preview */}
              {document && (
                <View style={{ marginTop: 15 }}>
                  <Text style={{
                    color: COLORS.blueDarker,
                    fontSize: 14,
                    fontWeight: SIZES.font.weight.medium,
                    marginBottom: 10,
                  }}>Aperçu du document</Text>
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
          </FormCard>

          <Button
            label="Enregistrer"
            variant='secondary'
            disabled={isCreatingDocument}
            style={{ paddingVertical: SIZES.padding.s }}
            textStyle={{ textAlign: 'center', flex: 1 }}
            onPress={() => {
              handleSaveHistoryIntervention();
            }}
          />

        </Container>
      </ScrollView>
    </ScreenView>
  );
};

export default AddIntervention;

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