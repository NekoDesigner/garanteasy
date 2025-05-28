import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import "react-native-reanimated";

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

export default function RootLayout() {
  if (storybookEnabled) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const StorybookUI = require("../.storybook").default;
    return (
      <View style={styles.container}>
        <StorybookUI />
      </View>
    );
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Centre verticalement
    alignItems: "center", // Centre horizontalement
  },
});
