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
    <View style={[styles.container, style]}>
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {count}
          </Text>
        </View>
      </View>
      <View style={styles.documentsContainer}>
        <DocumentIcon />
        {count > 1 && (<DocumentIcon style={styles.secondDocument} />)}
      </View>
    </View>
  );
};

export default DocumentScannedIndicator;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 70, // Increased to accommodate rotated document and badge
    height: 114, // 80 (documents) + 34 (badge height)
    zIndex: 1000,
  },
  badgeContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 26,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // Ensure badge is above documents
  },
  badge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  badgeText: {
    color: COLORS.light,
    fontSize: 14,
    fontWeight: '700',
  },
  documentsContainer: {
    position: 'absolute',
    bottom: 5,
    left: 7, // Centered within the wider container
    width: 56,
    height: 80,
    overflow: 'visible', // Ensure rotated document is visible
    zIndex: 1, // Below badge
  },
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
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  secondDocument: {
    transform: [{ rotate: '10deg' }],
    elevation: 1, // Lower elevation for stacked effect
  },
});