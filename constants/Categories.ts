import { IChipsProps } from "../components/ui/Chips/@types";

export const CATEGORIES_BASE: IChipsProps[] = [
  { label: 'Gros électroménager', category: 'hoursehold-electricals', showIcon: true, onPress: () => {} },
  { label: 'Petit électroménager', category: 'small-electricals', showIcon: true, onPress: () => {} },
  { label: 'Bricolage', category: 'diy', showIcon: true, onPress: () => {} },
  { label: 'Jardin', category: 'garden', showIcon: true,  onPress: () => {} },
  { label: 'Mode', category: 'fashion', showIcon: true, onPress: () => {} },
  { label: 'Multimédia', category: 'multimedia', showIcon: true, onPress: () => {} },
  { label: 'Autre', category: 'other', showIcon: false, onPress: () => {} },
];

export const DYNAMIC_CATEGORIES_FILE_NAME = [
  { id: 'default-category-1', label: 'Gros électroménager', fileId: 'washingMachin' },
  { id: 'default-category-2', label: 'Petit électroménager', fileId: 'smallHousehold' },
  { id: 'default-category-3', label: 'Bricolage', fileId: 'diy' },
  { id: 'default-category-4', label: 'Jardin', fileId: 'garden' },
  { id: 'default-category-5', label: 'Mode', fileId: 'fashion' },
  { id: 'default-category-6', label: 'Multimédia', fileId: 'multimedia' }
];
