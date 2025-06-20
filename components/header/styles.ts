import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants";

export const LogoStyles = StyleSheet.create({
  text: {
    color: COLORS.blueDarker,
    fontFamily: SIZES.font.familly.default,
    fontSize: SIZES.font.xxl,
    fontWeight: SIZES.font.weight.semiBold,
}
});

export const HeaderStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: SIZES.padding.m,
    paddingVertical: SIZES.padding.s,
  }
});
