import { useSegments } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import RoundedIconButton from '../ui/RoundedIconButton';
import { HeaderStyles, LogoStyles } from './styles';

const Logo = () => {
  return (
    <Text style={LogoStyles.text}>GareantEasy</Text>
  );
};

const Header = () => {
  const segments = useSegments(); // Get the current route segments
  const LeftIconComponent = React.useMemo(() => {
    if (!segments.length) {
      return <RoundedIconButton icon="settings" onPress={() => {}} />;
    }
    return <RoundedIconButton icon="arrow-right" onPress={() => {}} />;
  }, [segments]);

  return (
    <View style={ HeaderStyles.container }>
      {LeftIconComponent}
      <Logo />
    </View>
  );
};

export default Header;