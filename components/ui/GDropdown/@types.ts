/**
 * IGDropdownProps - Duration Dropdown Component Types
 */

import { StyleProp, ViewStyle, TextStyle } from "react-native";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface IGDropdownProps {
  label: string;
  options: DropdownOption[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
  testID?: string;
  disabled?: boolean;
}
