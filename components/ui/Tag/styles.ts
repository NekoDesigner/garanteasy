import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../constants';
import { ITagProps } from './@types';

function getFontSizeStyles(size: 'small' | 'normal') {
  switch (size) {
    case 'normal':
      return SIZES.font.xs;
    case 'small':
      return SIZES.font.xxs;
    default:
      return SIZES.font.xs;
  }
}

const styles = ({ size = 'normal' }: Omit<ITagProps, 'label'>) => (StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.padding.xxs,
    paddingHorizontal: SIZES.padding.xs,
    gap: SIZES.padding.xxs,
    borderRadius: SIZES.padding.xxs,
    backgroundColor: COLORS.light,
  },
  text: {
    fontSize: getFontSizeStyles(size),
    color: COLORS.blueDarker,
    fontFamily: SIZES.font.familly.default,
    fontWeight: SIZES.font.weight.semiBold,
  },
  icon: {
    width: SIZES.icon.xs,
    height: SIZES.icon.xs,
    color: COLORS.blueDarker
  }
}));

export default styles;
