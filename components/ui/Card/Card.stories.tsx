import React from "react";
import { View, Text } from "react-native";
import FashionIcon from "../Icons/FashionIcon";
import GardenIcon from "../Icons/GardenIcon";
import MultimediaIcon from "../Icons/MultimediaIcon";
import ScanIcon from "../Icons/ScanIcon";
import Card from "./index";

export default {
  title: 'Card',
  component: Card
};

export const Default = () => (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16, gap: 24, flexWrap: 'wrap' }}>
      <Card>
        <Text>Jardin</Text>
        <GardenIcon />
    </Card>
    <Card>
        <Text>Multimédia</Text>
        <MultimediaIcon />
    </Card>
    <Card>
        <Text>Mode</Text>
        <FashionIcon />
    </Card>
    <Card>
        <Text>Catégorie</Text>
        <ScanIcon />
    </Card>
    </View>
);
