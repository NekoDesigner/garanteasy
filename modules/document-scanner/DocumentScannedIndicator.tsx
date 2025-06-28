import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '../../constants';

const DocumentIcon = ({ style }: { style?: object }) => {
  return (
    <View style={[styles.paper, style]} />
  );
};

interface DocumentScannedIndicatorProps {
  style?: object;
  count: number;
}

const DocumentScannedIndicator: React.FC<DocumentScannedIndicatorProps> = ({ style, count }) => {
  return (
    <View style={[{ position: 'absolute', bottom: 20, left: 20, zIndex: 1000 }, style]}>
      <DocumentIcon />
      {count > 1 && (<DocumentIcon style={{ transform: [{ rotate: '10deg' }] }} />)}
      <View style={{ position: 'absolute', width: 56, height: 80, top: -80, left: 0, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: COLORS.light, fontSize: 14, fontWeight: '700' }}>
            {count}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DocumentScannedIndicator;

const styles = StyleSheet.create({
  paper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 56,
    height: 80,
    borderWidth: 1,
    borderColor: COLORS.blueDarker,
    borderRadius: 2,
    backgroundColor: COLORS.greyLighter,
    opacity: 0.8,
  }
});