import { useFonts, Ubuntu_400Regular, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import * as Notifications from 'expo-notifications';
import { Slot } from "expo-router";
import { SQLiteProvider, SQLiteDatabase } from 'expo-sqlite';
import { Suspense, useEffect } from 'react';
import { View, StyleSheet, Text } from "react-native";
import "react-native-reanimated";
import { DATABASE_MIGRATIONS } from "../database";
import { DATABASE_NAME } from "../database/db";
import { Migrate } from "../database/migrate";
import { OnboardingProvider } from "../providers/OnboardingContext";
import { UserProvider } from "../providers/UserContext";
import { ImageService } from "../services/ImageService";


const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";
const resetDBOnInit = process.env.EXPO_PUBLIC_RESET_DB_ON_INIT === "true";

// Create a function that handles reset and migrations
const handleDatabaseInit = async (db: SQLiteDatabase) => {
  try {
    console.log('🚀 Starting database initialization...');
    // If reset is needed, clear all data from the database
    if (resetDBOnInit) {
      try {
        // Get all table names
        const tables = await db.getAllAsync<{ name: string }>(`
          SELECT name FROM sqlite_master 
          WHERE type='table' AND name NOT LIKE 'sqlite_%'
        `);

        // Drop all tables
        for (const table of tables) {
          await db.execAsync(`DROP TABLE IF EXISTS ${table.name}`);
          if (table.name === 'notifications') {
            await Notifications.cancelAllScheduledNotificationsAsync();
          }
        }

        // Reset the database version so migrations will run again
        await db.execAsync(`PRAGMA user_version = 0`);

        console.log('✅ Database reset successfully - all tables dropped and version reset');
      } catch (error) {
        console.error('Error resetting database:', error);
      }
    }

    // Then run migrations (which will recreate the tables)
    const migrateInstance = new Migrate({ migrations: DATABASE_MIGRATIONS, database: db });
    await migrateInstance.run();

    console.log('✅ Database initialization completed successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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
  const [fontsLoaded] = useFonts({
    Ubuntu_400Regular,
    Ubuntu_700Bold,
  });

  useEffect(() => {
    // Initialize image directories on app start
    ImageService.initializeDirectories().catch(error => {
      console.error('Failed to initialize image directories:', error);
    });
  }, []);

  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
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

  if (!fontsLoaded) {
    return <Fallback />; // ou un splash screen
  }

  return (
    <Suspense fallback={<Fallback />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        onInit={async (db: SQLiteDatabase) => {
          await handleDatabaseInit(db);
        }}
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
