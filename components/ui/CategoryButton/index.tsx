import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../../../constants/Colors";
import WashingMachinIcon from "../Icons/WashingMachinIcon";
import { COLORS, SIZES } from "../constants";

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    borderWidth: 1,
    backgroundColor: COLORS.emerald,
    paddingVertical: SIZES.padding.xs,
    paddingHorizontal: SIZES.padding.m,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.padding.xxs,
  },
  buttonText: {
    color: Colors.white,
    fontSize: SIZES.font.m,
    fontWeight: SIZES.font.weight.semiBold,
    fontFamily: SIZES.font.familly.default,
  },
});

type TCategoryIcon =
  | "hoursehold-electricals"
  | "small-electricals"
  | "diy"
  | "garden"
  | "fashion"
  | "other";

interface CategoryButtonProps {
  category: TCategoryIcon | React.ReactNode;
  text: string;
  size?: "s" | "xs";
  showIcon?: boolean;
  onPress?: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
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
  const getCategoryIcon = (category: TCategoryIcon | React.ReactNode) => {
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

export default CategoryButton;
