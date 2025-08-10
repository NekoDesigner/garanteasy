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

export const DYNAMIC_CATEGORIES_FILE_NAME = [
  { id: 'default-category-1', label: 'Électroménagé', fileId: 'washingMachin' },
  { id: 'default-category-2', label: 'Petit éléctroménagé', fileId: 'smallHousehold' },
  { id: 'default-category-3', label: 'Bricolage', fileId: 'diy' },
  { id: 'default-category-4', label: 'Jardin', fileId: 'garden' },
  { id: 'default-category-5', label: 'Mode', fileId: 'fashion' },
  { id: 'default-category-6', label: 'Multimédia', fileId: 'multimedia' }
];
