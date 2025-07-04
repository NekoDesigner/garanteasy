import React from "react";
import { View, Text } from "react-native";
import { ITagProps } from "./@types";
import TagStyles from "./styles";

const Tag: React.FC<ITagProps> = ({ style = {}, testID = 'tag', size = 'normal', textStyle = {}, label, showIcon = true, icon, iconPosition = 'left' }) => {

  const styles = React.useMemo(() => {
    return TagStyles({ size });
  }, [size]);

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
  }, [showIcon, icon, styles.icon, testID]);

  return (
    <View style={[styles.container, style]} testID={testID}>
      {showIcon && iconPosition === "left" && renderIcon}
      <Text style={[styles.text, textStyle]} testID={`${testID}-text`}>{label}</Text>
      {showIcon && iconPosition === "right" && renderIcon}
    </View>
  );
};

export default Tag;
