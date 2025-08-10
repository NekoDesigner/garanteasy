import React from 'react';
import AddIcon from './AddIcon';
import ArrowIcon from './ArrowIcon';
import CalendarIcon from './CalendarIcon';
import CheckIcon from './CheckIcon';
import CloseIcon from './CloseIcon';
import CropIcon from './CropIcon';
import DIYIcon from './DIYIcon';
import FashionIcon from './FashionIcon';
import GardenIcon from './GardenIcon';
import ImageIcon from './ImageIcon';
import MultimediaIcon from './MultimediaIcon';
import PenIcon from './PenIcon';
import PictureIcon from './PictureIcon';
import ScanIcon from './ScanIcon';
import SearchIcon from './SearchIcon';
import SettingsIcon from './SettingsIcon';
import SmallHouseholdIcon from './SmallHouseholdIcon';
import TrashIcon from './TrashIcon';
import UploadIcon from './UploadIcon';
import WashingMachinIcon from './WashingMachinIcon';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

// Icon registry - maps icon names to their components
const iconRegistry: Record<string, React.ComponentType<any>> = {
  add: AddIcon,
  arrow: ArrowIcon,
  calendar: CalendarIcon,
  check: CheckIcon,
  close: CloseIcon,
  crop: CropIcon,
  diy: DIYIcon,
  fashion: FashionIcon,
  garden: GardenIcon,
  image: ImageIcon,
  multimedia: MultimediaIcon,
  pen: PenIcon,
  picture: PictureIcon,
  scan: ScanIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  smallHousehold: SmallHouseholdIcon,
  trash: TrashIcon,
  upload: UploadIcon,
  washingMachin: WashingMachinIcon,
};

const DynamicIcon = ({ name, size = 24, color = 'black' }: IconProps) => {
  const IconComponent = iconRegistry[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }

  return <IconComponent width={size} height={size} fill={color} />;
};

export default DynamicIcon;