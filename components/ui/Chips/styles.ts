import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../constants";

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    borderWidth: 1,
    backgroundColor: COLORS.emerald,
    paddingVertical: SIZES.padding.xs,
    paddingHorizontal: SIZES.padding.m,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: SIZES.padding.xxs,
  },
  buttonText: {
    color: COLORS.light,
    fontSize: SIZES.font.m,
    fontWeight: SIZES.font.weight.semiBold,
    fontFamily: SIZES.font.familly.default,
  },
});

export default styles;
