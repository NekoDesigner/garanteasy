import { IChipsProps } from "../components/ui/Chips/@types";

export const CATEGORIES_BASE: IChipsProps[] = [
  { label: 'Électroménagé', category: 'hoursehold-electricals', showIcon: true, onPress: () => {} },
  { label: 'Petit éléctroménagé', category: 'small-electricals', showIcon: true, onPress: () => {} },
  { label: 'Bricolage', category: 'diy', showIcon: true, onPress: () => {} },
  { label: 'Jardin', category: 'garden', showIcon: true,  onPress: () => {} },
  { label: 'Mode', category: 'fashion', showIcon: true, onPress: () => {} },
  { label: 'Multimédia', category: 'multimedia', showIcon: true, onPress: () => {} },
  { label: 'Autre', category: 'other', showIcon: false, onPress: () => {} },
];