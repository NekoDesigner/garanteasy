import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../constants';

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.radius.l,
    paddingVertical: SIZES.padding.l,
    paddingHorizontal: SIZES.padding.s,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.padding.xs,
    height: 138,
    width: 155,
    backgroundColor: COLORS.blueDarker
  },
  text: {
    color: COLORS.light,
    fontFamily: 'Ubuntu',
    fontSize: SIZES.font.m,
    fontWeight: '700',
    textAlign: 'center'
  },
  icon: {
    width: SIZES.icon.l,
    height: SIZES.icon.l,
    color: COLORS.light,
  }
});

export default styles;
