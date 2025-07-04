import React from "react";
import { View, Text } from "react-native";
import FashionIcon from "../Icons/FashionIcon";
import GardenIcon from "../Icons/GardenIcon";
import MultimediaIcon from "../Icons/MultimediaIcon";
import ScanIcon from "../Icons/ScanIcon";
import CategoryCard from "./index";

export default {
  title: 'Card',
  component: CategoryCard
};

export const Default = () => (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16, gap: 24, flexWrap: 'wrap' }}>
      <CategoryCard>
        <Text>Jardin</Text>
        <GardenIcon />
    </CategoryCard>
    <CategoryCard>
        <Text>Multimédia</Text>
        <MultimediaIcon />
    </CategoryCard>
    <CategoryCard>
        <Text>Mode</Text>
        <FashionIcon />
    </CategoryCard>
    <CategoryCard>
        <Text>Catégorie</Text>
        <ScanIcon />
    </CategoryCard>
    </View>
);
