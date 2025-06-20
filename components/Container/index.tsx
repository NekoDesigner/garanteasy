import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SIZES } from '../../constants';

interface ContainerProps extends PropsWithChildren {
  style?: object;
}

const Container = ({ children, style = {} }: ContainerProps) => {
  return (
    <View style={[{ paddingHorizontal: SIZES.padding.m }, style]}>
      {children}
    </View>
  );
};

export default Container;