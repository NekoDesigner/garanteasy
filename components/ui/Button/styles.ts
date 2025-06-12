import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../constants';
import { TButtonVariant } from './@types';

interface IButtonStyles {
  size: 's' | 'xs';
  variant: TButtonVariant;
  disabled?: boolean;
}

function getColor(variant: string): string {
  switch (variant) {
    case 'primary':
      return COLORS.primary;
    case 'secondary':
      return COLORS.emerald;
    case 'danger':
      return COLORS.danger;
    default:
      return 'transparent';
  }
}

const ButtonStyles = function ({
  size = 's',
  variant = 'primary',
  disabled = false,
}: IButtonStyles) {
  return StyleSheet.create({
    button: {
      borderRadius: SIZES.padding.xxs,
      borderWidth: variant.startsWith('outline') ? 1 : 0,
      borderColor: variant.startsWith('outline')
        ? getColor(variant.split('-')[1]) : 'transparent',
      backgroundColor: getColor(variant),
      paddingVertical: SIZES.padding.xs,
      paddingHorizontal: SIZES.padding.m,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: SIZES.padding.xs,
      opacity: disabled ? 0.5 : 1,
    },
    buttonText: {
      color: variant.startsWith('outline') ? getColor(variant.split('-')[1]) : COLORS.light,
      fontSize: SIZES.font.m,
      fontWeight: SIZES.font.weight.semiBold,
      fontFamily: SIZES.font.familly.default,
    },
    icon: {
      width: size === 's' ? SIZES.icon.m : SIZES.icon.xs,
      height: size === 's' ? SIZES.icon.m : SIZES.icon.xs,
      color: variant.startsWith('outline') ? getColor(variant.split('-')[1]) : COLORS.light,
    }
  });
};

export default ButtonStyles;
