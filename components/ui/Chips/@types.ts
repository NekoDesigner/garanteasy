export type TChipsIcon =
  | "hoursehold-electricals"
  | "small-electricals"
  | "diy"
  | "garden"
  | "fashion"
  | "multimedia"
  | "other";

export interface IChipsProps {
  category: TChipsIcon | React.ReactNode;
  label: string;
  size?: "s" | "xs";
  showIcon?: boolean;
  onPress?: () => void;
}
