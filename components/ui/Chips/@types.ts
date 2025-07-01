export type TChipsIcon =
  | "hoursehold-electricals"
  | "small-electricals"
  | "diy"
  | "garden"
  | "fashion"
  | "multimedia"
  | "other"
  | "default-category-1"
  | "default-category-2"
  | "default-category-3"
  | "default-category-4"
  | "default-category-5"
  | "default-category-6"
  | "default-category-7";

export interface IChipsProps {
  category: TChipsIcon | React.ReactNode;
  label: string;
  size?: "s" | "xs";
  showIcon?: boolean;
  onPress?: () => void;
  style?: object;
}
