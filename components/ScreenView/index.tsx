import React, { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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