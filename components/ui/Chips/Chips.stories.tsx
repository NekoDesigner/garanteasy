import React from 'react';
import { View } from 'react-native';
import Chips from './index';

export default {
  title: 'Chips',
  component: Chips,
};

export const Default = () => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 16 }}>
    <Chips label="Default Chips" category="diy" showIcon={false} />
  </View>
);

export const WithIcon = () => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 16 }}>
    <Chips label="Bricolage" category="diy" showIcon />
  </View>
);