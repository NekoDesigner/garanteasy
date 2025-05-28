import { Slot } from "expo-router";
import { View } from "react-native";
import "react-native-reanimated";

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

export default function RootLayout() {
  if (storybookEnabled) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const StorybookUI = require("../.storybook").default;
    return (
      <View style={{ flex: 1 }}>
        <StorybookUI />
      </View>
    );
  }

  return <Slot />;
}
