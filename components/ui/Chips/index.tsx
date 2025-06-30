import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { COLORS, SIZES } from "../../../constants";
import DIYIcon from "../Icons/DIY";
import FashionIcon from "../Icons/FashionIcon";
import GardenIcon from "../Icons/GardenIcon";
import MultimediaIcon from "../Icons/MultimediaIcon";
import SmallHouseholdIcon from "../Icons/SmallHouseholdIcon";
import WashingMachinIcon from "../Icons/WashingMachinIcon";
import { IChipsProps, TChipsIcon } from "./@types";
import styles from "./styles";

const Chips: React.FC<IChipsProps> = ({
  category,
  label,
  size = "s",
  showIcon = true,
  onPress,
  style = {}
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
      case "default-category-1":
        return <WashingMachinIcon color={COLORS.light} size={getSize()} />;
      case "small-electricals":
      case "default-category-2":
        return <SmallHouseholdIcon color={COLORS.light} size={getSize()} />;
      case "diy":
      case "default-category-3":
        return <DIYIcon color={COLORS.light} size={getSize()} />;
      case "garden":
      case "default-category-4":
        return <GardenIcon color={COLORS.light} size={getSize()} />;
      case "fashion":
      case "default-category-5":
        return <FashionIcon color={COLORS.light} size={getSize()} />;
      case "multimedia":
      case "default-category-6":
        return <MultimediaIcon color={COLORS.light} size={getSize()} />;
      case "other":
      case "default-category-7":
        return <WashingMachinIcon color={COLORS.light} size={getSize()} />;
      default:
        return category;
    }
  };
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={onPress === undefined}
    >
      {showIcon && (
        <View testID="category-icon">{getCategoryIcon(category)}</View>
      )}
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Chips;
