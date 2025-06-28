import { useRouter, useSegments } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import RoundedIconButton from '../ui/RoundedIconButton';
import { HeaderStyles, LogoStyles } from './styles';

const Logo: React.FC = () => {
  return (
    <Text style={LogoStyles.text}>GareantEasy</Text>
  );
};

const Header: React.FC = () => {
  const segments = useSegments(); // Get the current route segments
  const router = useRouter();
  const LeftIconComponent = React.useMemo(() => {
    if (!segments.length) {
      return <RoundedIconButton icon="settings" onPress={() => {}} />;
    }
    return <RoundedIconButton icon="arrow-left" onPress={() => { router.back(); }} />;
  }, [segments, router]);

  return (
    <View style={ HeaderStyles.container }>
      {LeftIconComponent}
      <Logo />
    </View>
  );
};

export default Header;