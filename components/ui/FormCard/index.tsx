/**
 * FormCard - Generated by Garanteasier CLI
 */

import React from "react";
import { View } from "react-native";
import { IFormCardProps } from "./@types";
import FormCardStyles from "./styles";

const FormCard: React.FC<IFormCardProps> = ({style, testID = 'formcard', children, ...props}) => {
  return (
    <View style={[FormCardStyles.container, style]} testID={testID} {...props}>
      {children}
    </View>
  );
};

export default FormCard;
