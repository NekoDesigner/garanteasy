import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, ScrollView, ActivityIndicator, View } from 'react-native';
import Container from '../components/Container';
import ScreenView from '../components/ScreenView';
import Button from '../components/ui/Button';
import Chips from '../components/ui/Chips';
import CustomAlert from '../components/ui/CustomAlert';
import FormCard from '../components/ui/FormCard';
import PDFPreview from '../components/ui/PDFPreview';
import ProductCard from '../components/ui/ProductCard';
import { COLORS, SIZES } from '../constants';
import { useItemRepository } from '../hooks/useItemRepository/useItemRepository';
import { History } from '../models/History/History';
import { Item } from '../models/Item/Item';
import { useUserContext } from '../providers/UserContext';
import { DateService } from '../services/DateService';

/**
 * Écran de visualisation détaillée d'un item de garantie
 *
 * @component ShowItem
 * @description Composant d'écran qui affiche tous les détails d'un item de garantie incluant :
 * - Les informations du produit (marque, nom, date d'achat, durée de garantie)
 * - L'image du produit
 * - Le document de garantie principal (PDF)
 * - Les documents additionnels (factures, etc.)
 * - L'historique des interventions avec leurs documents associés
 * - La catégorie du produit
 * - Les notes personnelles
 * - Actions disponibles : modification, archivage et suppression
 *
 * @route /show-item?itemId={string}
 * @param itemId - ID de l'item à afficher (passé via les paramètres d'URL)
 *
 * @returns {JSX.Element} L'écran de visualisation de l'item
 *
 * @example
 * // Navigation vers cet écran
 * router.push({
 *   pathname: '/show-item',
 *   params: { itemId: 'item-123' }
 * });
 *
 * @throws {Error} Redirige vers l'écran principal si l'item n'est pas trouvé
 *
 * @see {@link Item} - Modèle de données de l'item
 * @see {@link useItemRepository} - Hook pour les opérations sur les items
 * @see {@link ProductCard} - Composant d'affichage des informations produit
 * @see {@link PDFPreview} - Composant de prévisualisation des documents PDF
 */
const ShowItem = () => {
  // Navigation et paramètres d'URL
  const router = useRouter();
  const { itemId } = useLocalSearchParams<{ itemId: string }>();

  // Contexte utilisateur et repository
  const { user } = useUserContext();
  const { getItemById, archiveItem, deleteItem } = useItemRepository({ ownerId: user?.id ?? '' });

  // États locaux
  /** L'item actuellement affiché */
  const [item, setItem] = React.useState<Item | null>(null);
  /** Contrôle l'affichage de l'alerte de confirmation de suppression */
  const [showAlert, setShowAlert] = React.useState(false);
  /** Indique si une opération (archivage/suppression) est en cours */
  const [isProcessing, setIsProcessing] = React.useState(false);

  /**
   * Archive l'item actuel
   * @description Marque l'item comme archivé sans le supprimer définitivement.
   * L'utilisateur est redirigé vers l'écran principal après l'opération.
   */
  const handleArchive = () => {
    setIsProcessing(true);
    if (!item) {
      setIsProcessing(false);
      return;
    }
    archiveItem(item);
    router.replace({
      pathname: '/',
      params: { refresh: 'true' }
    }); // Retourner à la liste des items après l'archivage
  };

  /**
   * Supprime définitivement l'item actuel
   * @description Supprime l'item de la base de données de manière permanente.
   * L'utilisateur est redirigé vers l'écran principal après l'opération.
   * @async
   */
  const handleDelete = async () => {
    setIsProcessing(true);
    if (!item) {
      setIsProcessing(false);
      return;
    }
    await deleteItem(item);
    router.replace({
      pathname: '/',
      params: { refresh: 'true' }
    }); // Retourner à la liste des items après la suppression
  };

  /**
   * Ferme l'alerte de confirmation
   * @description Masque l'alerte de confirmation de suppression/archivage
   */
  const handleClose = () => {
    setShowAlert(false);
  };

  /**
   * Effet de chargement des données de l'item
   * @description Récupère les données de l'item à partir de son ID passé en paramètre URL.
   * Si l'item n'existe pas, redirige vers l'écran principal.
   * Se déclenche au montage du composant et lors du changement de l'itemId.
   */
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

  // État de chargement - Affiche un indicateur pendant la récupération des données
  if (!item) {
    return (
      <ScreenView>
        <Container>
          <ActivityIndicator size="large" color={COLORS.blueDarker} />
        </Container>
      </ScreenView>
    );
  }

  // Rendu principal de l'écran
  return (
    <ScreenView>
      <ScrollView>
        <Container style={{ paddingBottom: SIZES.padding.m }}>
          {/* Carte d'information principale du produit */}
          <ProductCard
            brand={item?.brand || 'Unknown Brand'}
            name={item?.label || 'Unknown Item'}
            purchaseDate={item?.purchaseDate || new Date()}
            warrantyDuration={item?.warrantyDuration || 'Aucune garantie'}
            image={item?.pictureUri}
            style={styles.space}
          />

          {/* Section document de garantie principal */}
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

          {/* Section documents additionnels (conditionnelle) */}
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

          {/* Section historique des interventions (conditionnelle) */}
          {item?.interventions && item.interventions.length > 0 && (
            <FormCard style={styles.space}>
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
            </FormCard>
          )}

          {/* Section catégorie */}
          <FormCard style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', alignItems: 'center' }, styles.space]}>
            <Text style={styles.h1}>Categorie</Text>
            <Chips label={item?.category?.name || ""} category={item?.category?.id || 'other'} showIcon={item?.category?.showIcon()} />
          </FormCard>

          {/* Section notes personnelles (conditionnelle) */}
          {item?.memo && (
            <FormCard style={styles.space}>
              <Text style={styles.h1}>Note</Text>
              <Text>{item?.memo || 'Aucune note'}</Text>
            </FormCard>
          )}

          {/* Boutons d'action */}
          {!item.isArchived && <Button
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
          />}
          <Button
            label="Supprimer le produit"
            variant={item.isArchived ? 'danger' : 'outline-danger'}
            style={{ paddingVertical: SIZES.padding.s, marginTop: SIZES.padding.xs }}
            textStyle={{ textAlign: 'center', flex: 1 }}
            onPress={() => {
              setShowAlert(true);
            }}
          />
        </Container>
      </ScrollView>

      {/* Alerte de confirmation pour suppression/archivage */}
      <CustomAlert
        visible={showAlert}
        onClose={handleClose}
      >
        <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 8, fontFamily: SIZES.font.familly.default, fontWeight: SIZES.font.weight.semiBold }}>
          Voulez-vous vraiment supprimer ce produit ?
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', gap: 10, marginTop: SIZES.padding.xl }}>
          {!item.isArchived && <CustomAlert.Action disabled={isProcessing} buttonStyle={{ flex: 1 }} label="Archiver" onPress={handleArchive} type="emerald" />}
          <CustomAlert.Action disabled={isProcessing} buttonStyle={{ flex: 1 }} label="Supprimer" onPress={handleDelete} type="outline-danger" />
        </View>
      </CustomAlert>
    </ScreenView>
  );
};

export default ShowItem;

/**
 * Styles du composant ShowItem
 * @description Définit les styles utilisés dans le composant :
 * - h1: Style pour les titres de sections
 * - space: Marge inférieure standard entre les sections
 * - pdfPreview: Style pour les prévisualisations de documents PDF
 */
const styles = StyleSheet.create({
  /** Style des titres de section */
  h1: {
    fontSize: SIZES.font.m,
    fontWeight: SIZES.font.weight.semiBold,
    fontFamily: SIZES.font.familly.default,
  },
  /** Espacement standard entre les sections */
  space: {
    marginBottom: SIZES.padding.m,
  },
  /** Style des prévisualisations PDF */
  pdfPreview: {
    marginBottom: 10,
    borderRadius: SIZES.radius.s,
    overflow: 'hidden',
  },
});