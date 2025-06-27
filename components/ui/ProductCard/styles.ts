import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../../constants';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 8,
    backgroundColor: COLORS.greyLighter,
   borderColor: COLORS.greyDarker,
    borderWidth: 1,
    borderRadius: 8,
    gap: 8,
    maxWidth: 327,
  },
  image: {
    borderRadius: 4,
    width: 64,
    height: 64,
  },
  tags: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  tagsText: {
    color: COLORS.blueDarker,
    fontFamily: SIZES.font.familly.default,
    fontSize: SIZES.font.xxs,
  },
  brandContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
},
  name: {
    color: COLORS.blueDarker,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontFamily: SIZES.font.familly.default,
    fontWeight: SIZES.font.weight.semiBold,
    fontSize: SIZES.font.xl,
  },
  brand: {
    color: COLORS.blueDarker,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontFamily: SIZES.font.familly.default,
    fontWeight: SIZES.font.weight.semiBold,
    fontSize: SIZES.font.xs,
  },
});

export default styles;
