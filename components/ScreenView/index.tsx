import React, { PropsWithChildren } from 'react';
import { Keyboard, KeyboardAvoidingView, SafeAreaView, StatusBar, TouchableWithoutFeedback } from 'react-native';
import Header from '../Header';

interface ScreenViewProps extends PropsWithChildren {
  style?: object;
}

const ScreenView: React.FC<ScreenViewProps> = ({ children, style }: ScreenViewProps) => {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: '#FFF' }, style]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <StatusBar barStyle="dark-content" />
            <Header />
            {children}
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
  );
};

export default ScreenView;