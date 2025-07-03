import 'react-native-get-random-values'; // Required for pdf-lib and other crypto operations
import { Buffer } from 'buffer';
import { Slot } from "expo-router";
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense, useEffect } from 'react';
import { View, StyleSheet, Text } from "react-native";
import "react-native-reanimated";
import { DATABASE_MIGRATIONS } from "../database";
import { DATABASE_NAME } from "../database/db";
import { Migrate } from "../database/migrate";
import { OnboardingProvider } from "../providers/OnboardingContext";
import { UserProvider } from "../providers/UserContext";
import { ImageService } from "../services/ImageService";

// Make Buffer available globally for React Native
global.Buffer = Buffer;

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";
const resetDBOnInit = process.env.EXPO_PUBLIC_RESET_DB_ON_INIT === "true";

// Create a function that handles reset and migrations
const handleDatabaseInit = async (db: any) => {
  // If reset is needed, clear all data from the database
  if (resetDBOnInit) {
    try {
      // Get all table names
      const tables = await db.getAllAsync(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
      `);

      // Drop all tables
      for (const table of tables) {
        await db.execAsync(`DROP TABLE IF EXISTS ${table.name}`);
      }

      // Reset the database version so migrations will run again
      await db.execAsync(`PRAGMA user_version = 0`);

      console.log('✅ Database reset successfully - all tables dropped and version reset');
    } catch (error) {
      console.error('Error resetting database:', error);
    }
  }

  // Then run migrations (which will recreate the tables)
  const migrateInstance = new Migrate({ migrations: DATABASE_MIGRATIONS });
  await migrateInstance.run();
};

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
  useEffect(() => {
    // Initialize image directories on app start
    ImageService.initializeDirectories().catch(error => {
      console.error('Failed to initialize image directories:', error);
    });
  }, []);

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
        onInit={handleDatabaseInit}
        options={{ useNewConnection: false }}
        useSuspense
      >
        <UserProvider>
          <OnboardingProvider>
            <Slot />
          </OnboardingProvider>
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
