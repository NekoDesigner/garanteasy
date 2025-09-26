import { StyleSheet } from "react-native";
import { COLORS } from "../../../constants/Colors";

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    backgroundColor: COLORS.light,
    borderRadius: 16,
    padding: 24,
    margin: "1%",
    maxWidth: "90%",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    // marginBottom: 24,
  },
  closeButton: {
    padding: 8,
  },
  actionsContainer: {
    flexDirection: "column",
    gap: 12,
  },
});

export const actionStyles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  // Primary
  primary: {
    backgroundColor: COLORS.primary,
  },
  primaryText: {
    color: COLORS.light,
  },
  // Secondary
  secondary: {
    backgroundColor: COLORS.grey,
  },
  secondaryText: {
    color: COLORS.primary,
  },
  // Danger
  danger: {
    backgroundColor: COLORS.danger,
  },
  dangerText: {
    color: COLORS.light,
  },
  // Emerald
  emerald: {
    backgroundColor: COLORS.emerald,
  },
  emeraldText: {
    color: COLORS.light,
  },
  // Outline Primary
  outlinePrimary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  outlinePrimaryText: {
    color: COLORS.primary,
  },
  // Outline Secondary
  outlineSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.grey,
  },
  outlineSecondaryText: {
    color: COLORS.placeholder,
  },
  // Outline Danger
  outlineDanger: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  outlineDangerText: {
    color: COLORS.danger,
  },
  // Outline Emerald
  outlineEmerald: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.emerald,
  },
  outlineEmeraldText: {
    color: COLORS.emerald,
  },
});

export default styles;