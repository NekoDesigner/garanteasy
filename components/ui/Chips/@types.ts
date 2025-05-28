export type TChipsIcon =
  | "hoursehold-electricals"
  | "small-electricals"
  | "diy"
  | "garden"
  | "fashion"
  | "other";

export interface IChipsProps {
  category: TChipsIcon | React.ReactNode;
  text: string;
  size?: "s" | "xs";
  showIcon?: boolean;
  onPress?: () => void;
}
