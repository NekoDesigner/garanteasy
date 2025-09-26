import { useRouter } from "expo-router";
import React from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import Container from "../components/Container";
import ScreenView from "../components/ScreenView";
import BookIcon from "../components/ui/Icons/BookIcon";
import ProductCard from "../components/ui/ProductCard";
import { COLORS, SIZES } from "../constants";
import { useItemRepository } from "../hooks/useItemRepository/useItemRepository";
import { Item } from "../models/Item/Item";
import { useUserContext } from "../providers/UserContext";

const ArchivedItem = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const { getAllItems } = useItemRepository({ ownerId: user?.id || "" });

  const [archivedItems, setArchivedItems] = React.useState<Item[]>([]);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const fetchArchivedItems = React.useCallback(async () => {
    const items = await getAllItems({ byArchived: true });
    setArchivedItems(items);
  }, [getAllItems]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchArchivedItems();
    setRefreshing(false);
  };

  React.useEffect(() => {
    fetchArchivedItems();
  }, [fetchArchivedItems, getAllItems]);
  return <ScreenView>
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: SIZES.padding.m,
            gap: SIZES.padding.xs,
            marginTop: SIZES.padding.l,
          }}>
          <BookIcon size={24} color={COLORS.primary} />
          <Text style={{
              fontSize: SIZES.font.xl,
              fontWeight: SIZES.font.weight.semiBold,
              fontFamily: SIZES.font.familly.default,
            }}>Archive</Text>
        </View>

        {archivedItems.length === 0 ? (
          <Text style={{
              fontSize: SIZES.font.m,
              color: COLORS.placeholder,
              textAlign: "center",
              marginTop: SIZES.padding.m,
            }}>Aucun élément archivé</Text>
        ) : (
          <FlatList
              style={{ flex: 1 }}
              data={archivedItems}
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
  </ScreenView>;
};

export default ArchivedItem;