import { useRouter, useSegments, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import { useDocumentRepository } from '../../hooks/useDocumentRepository/useDocumentRepository';
import { useUserContext } from '../../providers/UserContext';
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
  const params = useLocalSearchParams();
  const { user } = useUserContext();
  const { ghostbuster } = useDocumentRepository({ ownerId: user?.id || '' });
  const LeftIconComponent = React.useMemo(() => {
    if (!segments.length) {
      return <RoundedIconButton icon="settings" onPress={() => {}} />;
    }
    if (segments[segments.length - 1] === 'scanner' && params?.reviewMode) {
      return <RoundedIconButton icon="close" onPress={() => { router.dismissAll(); }} />;
    }
    let handleAction: () => Promise<void> = () => Promise.resolve(router.back());
    if (segments[segments.length - 1] === 'create-item') {
      handleAction = async () => {
        // Remove all documents with no attachments
        await ghostbuster();
        router.back();
      };
    }
    return <RoundedIconButton icon="arrow-left" onPress={async () => { await handleAction(); }} />;
  }, [segments, router, params, ghostbuster]);

  return (
    <View style={ HeaderStyles.container }>
      {LeftIconComponent}
      <Logo />
    </View>
  );
};

export default Header;