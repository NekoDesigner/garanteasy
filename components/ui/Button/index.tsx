import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { IButtonProps } from "./@types";
import ButtonStyles from "./styles";

const Button: React.FC<IButtonProps> = ({
  label,
  onPress,
  disabled = false,
  style = {},
  testID = "button",
  size = "s",
  variant = "primary",
  icon,
  showIcon = false,
  iconPosition = "left",
}) => {
  const styles = React.useMemo(() => {
    return ButtonStyles({ size, variant, disabled });
  }
, [size, variant, disabled]);

const renderIcon = React.useMemo(() => {
  if (!showIcon || !icon || !React.isValidElement(icon)) return null;

  return React.cloneElement(
    icon as React.ReactElement<any>,
    {
      style: [
        styles.icon,
        (icon.props && typeof icon.props === 'object' && icon.props !== null && 'style' in icon.props
          ? icon.props.style
          : undefined),
      ],
      testID: `${testID}-icon`,
      color: styles.icon.color, // Ensure the icon color matches the button style
    }
  );
}, [showIcon, icon, styles.icon]);

  return <TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.button, style]} testID={testID}>
    {showIcon && iconPosition === "left" && renderIcon}
    <Text style={styles.buttonText} testID={`${testID}-label`}>
      {label}
    </Text>
    {showIcon && iconPosition === "right" && renderIcon}
  </TouchableOpacity>;
};

export default Button;
