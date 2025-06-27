import { Slot } from "expo-router";
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense } from 'react';
import { View, StyleSheet, Text } from "react-native";
import "react-native-reanimated";
import { DATABASE_MIGRATIONS } from "../database";
import { DATABASE_NAME } from "../database/db";
import { Migrate } from "../database/migrate";
import { UserProvider } from "../providers/UserContext";

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";
const migrateInstance = new Migrate(DATABASE_MIGRATIONS);
const runMigration = migrateInstance.run.bind(migrateInstance);

function Fallback() {
  return (
    <View style={styles.container}>
      <View>
        <Text>Loading...</Text>
      </View>
    </View>
  );
}

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

  return (
    <Suspense fallback={<Fallback />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        onInit={runMigration}
        options={{ useNewConnection: false }}
        useSuspense
      >
        <UserProvider>
          <Slot />
        </UserProvider>
      </SQLiteProvider>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Centre verticalement
    alignItems: "center", // Centre horizontalement
  },
});
