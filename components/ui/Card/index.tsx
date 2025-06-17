import React from "react";
import { View, Text } from "react-native";
import { ICardProps } from "./@types";
import CardStyles from "./styles";

const Card: React.FC<ICardProps> = ({ style, testID = 'card', children }) => {
  // Map over children and clone with styles if needed
  const styledChildren = React.useMemo(() =>
    React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        // Check if the child is a Text component
        if (
          (typeof child.type === 'function' && (child.type as any).displayName === 'Text') ||
          child.type === Text
        ) {
          return React.cloneElement(child as React.ReactElement<any>, {
            style: [CardStyles.text, child.props && (child.props as any).style],
          });
        }
        // Check if the child is an Icon component using Svg
        else if (
          typeof child.type === 'function' &&
          (
            (child.type as any).displayName?.toLowerCase().includes('icon') ||
            (child.type as any).name?.toLowerCase().includes('icon')
          )
        ) {
          // Optionally, you can check for a specific prop or static property that all your icons have
          return React.cloneElement(child as React.ReactElement<any>, {
            color: CardStyles.icon.color,
            size: CardStyles.icon.width,
            style: [CardStyles.icon, child.props && (child.props as any).style],
          });
        }
      }
      return child;
    })
  , [children]);

  return (
    <View style={[CardStyles.container, style]} testID={testID}>
      {styledChildren}
    </View>
  );
};

export default Card;
