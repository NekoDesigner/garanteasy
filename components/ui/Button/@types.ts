import { StyleProp, TextStyle } from "react-native";

export interface IButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: object;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  size?: "s" | "xs";
  variant?: TButtonVariant;
  icon?: React.ReactNode;
  showIcon?: boolean;
  iconPosition?: "left" | "right";
}

export type TButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "outline-primary"
  | "outline-secondary"
  | "outline-danger"
  | "link-primary"
  | "link-secondary"
  | "link-danger";
