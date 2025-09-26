import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { ICustomAlertActionProps } from "./@types";
import { actionStyles } from "./styles";

const CustomAlertAction: React.FC<ICustomAlertActionProps> = ({
  label,
  onPress,
  type = "primary",
  buttonStyle = {},
  textStyle = {},
  disabled = false
}) => {
  const getButtonStyle = () => {
    switch (type) {
      case "primary":
        return [actionStyles.button, actionStyles.primary];
      case "secondary":
        return [actionStyles.button, actionStyles.secondary];
      case "danger":
        return [actionStyles.button, actionStyles.danger];
      case "emerald":
        return [actionStyles.button, actionStyles.emerald];
      case "outline-primary":
        return [actionStyles.button, actionStyles.outlinePrimary];
      case "outline-secondary":
        return [actionStyles.button, actionStyles.outlineSecondary];
      case "outline-danger":
        return [actionStyles.button, actionStyles.outlineDanger];
      case "outline-emerald":
        return [actionStyles.button, actionStyles.outlineEmerald];
      default:
        return [actionStyles.button, actionStyles.primary];
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case "primary":
        return [actionStyles.buttonText, actionStyles.primaryText];
      case "secondary":
        return [actionStyles.buttonText, actionStyles.secondaryText];
      case "danger":
        return [actionStyles.buttonText, actionStyles.dangerText];
      case "emerald":
        return [actionStyles.buttonText, actionStyles.emeraldText];
      case "outline-primary":
        return [actionStyles.buttonText, actionStyles.outlinePrimaryText];
      case "outline-secondary":
        return [actionStyles.buttonText, actionStyles.outlineSecondaryText];
      case "outline-danger":
        return [actionStyles.buttonText, actionStyles.outlineDangerText];
      case "outline-emerald":
        return [actionStyles.buttonText, actionStyles.outlineEmeraldText];
      default:
        return [actionStyles.buttonText, actionStyles.primaryText];
    }
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), buttonStyle]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[...getTextStyle(), textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default CustomAlertAction;