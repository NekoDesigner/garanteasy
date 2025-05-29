import React from 'react';
import { Alert, View } from 'react-native';
import { IChipsProps } from './@types';
import Chips from './index';

export default {
  title: 'Chips',
  component: Chips,
};

export const Default = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
    <Chips label="Default Chips" category="diy" showIcon={false} />
  </View>
);

const chipVariants: IChipsProps[] = [
  { label: 'Électroménage', category: 'hoursehold-electricals', showIcon: true, onPress: () => Alert.alert('Électroménage pressed') },
  { label: 'Petit éléctroménagé', category: 'small-electricals', showIcon: true, onPress: () => Alert.alert('Petit éléctroménagé pressed') },
  { label: 'Bricolage', category: 'diy', showIcon: true, onPress: () => Alert.alert('Bricolage pressed') },
  { label: 'Jardin', category: 'garden', showIcon: true,  onPress: () => Alert.alert('Jardin pressed') },
  { label: 'Mode', category: 'fashion', showIcon: true, onPress: () => Alert.alert('Mode pressed') },
  { label: 'Multimédia', category: 'multimedia', showIcon: true, onPress: () => Alert.alert('Multimédia pressed') },
  { label: 'Autre', category: 'other', showIcon: false, onPress: () => Alert.alert('Autre pressed') },
];

export const WithIcons = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, gap: 24 }}>
    {chipVariants.map((props, idx) => (
      <Chips key={idx} {...props} />
    ))}
  </View>
);