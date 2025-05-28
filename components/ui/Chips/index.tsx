import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import WashingMachinIcon from "../Icons/WashingMachinIcon";
import { COLORS, SIZES } from "../constants";
import { IChipsProps, TChipsIcon } from "./@types";
import styles from "./styles";

const Chips: React.FC<IChipsProps> = ({
  category,
  text,
  size = "s",
  showIcon = true,
  onPress,
}) => {
  const getSize = () => {
    switch (size) {
      case "s":
        return SIZES.icon.s;
      case "xs":
        return SIZES.icon.xs;
      default:
        return SIZES.icon.s;
    }
  };
  const getCategoryIcon = (category: TChipsIcon | React.ReactNode) => {
    switch (category) {
      case "hoursehold-electricals":
      case "small-electricals":
      case "diy":
      case "garden":
      case "fashion":
      case "other":
        return <WashingMachinIcon color={COLORS.light} size={getSize()} />;
      default:
        return category;
    }
  };
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={onPress === undefined}
    >
      {showIcon && (
        <View testID="category-icon">{getCategoryIcon(category)}</View>
      )}
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Chips;
