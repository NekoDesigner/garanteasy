import React from "react";
import { View } from "react-native";
import ScanIcon from "../Icons/ScanIcon";
import Tag from "./index";

export default {
  title: 'Tag',
  component: Tag
};

export const Default = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, gap: 24 }}>
      <Tag label='Expire dans 40j'icon={<ScanIcon />} />
    </View>
);