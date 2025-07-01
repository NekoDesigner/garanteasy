import React, { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StatusBar } from 'react-native';
import Header from '../header';

interface ScreenViewProps extends PropsWithChildren {
  style?: object;
}

const ScreenView: React.FC<ScreenViewProps> = ({ children, style }: ScreenViewProps) => {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: '#FFF' }, style]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <StatusBar barStyle="dark-content" />
        <Header />
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ScreenView;