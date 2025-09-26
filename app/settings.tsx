import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, StyleSheet, View, TouchableOpacity, TextInput } from "react-native";
import Container from "../components/Container";
import ScreenView from "../components/ScreenView";
import ArrowIcon from "../components/ui/Icons/ArrowIcon";
import BookIcon from "../components/ui/Icons/BookIcon";
import DynamicIcon from "../components/ui/Icons/DynamicIcon";
import SwitchButton from "../components/ui/SwitchButton";
import Toast from "../components/ui/Toast";
import { COLORS, SIZES } from "../constants";
import { useNotificationsRepository } from "../hooks/useNotificationsRepository/useNotificationsRepository";
import { useSettingRepository } from "../hooks/useSettingRepository/useSettingRepository";
import { useToast } from "../hooks/useToast";
import { Setting } from "../models/Setting/Setting";
import { EKeySetting } from "../models/Setting/Setting.dto";

function Row({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      {children}
    </View>
  );
}

const SettingInput = ({ setting, onValueChange }: { setting: Setting, onValueChange: (value: string | boolean) => void }) => {
  const [value, setValue] = React.useState<string | boolean>(setting.value);

  const handleChange = (newValue: string | boolean) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  React.useEffect(() => {
    setValue(setting.value);
  }, [setting.value]);

  return (
    <>
      {setting.getInputType() === "switch" ? (
        <SwitchButton
          value={value === "true"}
          onValueChange={handleChange}
        />
      ) : (
        <TextInput
          value={String(value)}
          onChangeText={handleChange}
          keyboardType={setting.getInputType().replace("input-", "") as any}
        />
      )}
    </>
  );
};

const Settings = () => {
  const { getAllSettings, updateSettingByKey } = useSettingRepository();
  const { enableAllNotifications, removeAllNotifications } = useNotificationsRepository();
  const { toast, showToast, hideToast } = useToast();

  const [settings, setSettings] = React.useState<Setting[]>([]);

  const fetchSettings = React.useCallback(async () => {
    try {
      const allSettings = await getAllSettings();
      setSettings(allSettings);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  }, [getAllSettings]);

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSettingChange = async (key: EKeySetting, value: string | boolean): Promise<void> => {
    const updatedSettings = settings.map(setting => {
      if (setting.key === key) {
        setting.value = String(value);
        return setting;
      }
      return setting;
    });
    setSettings(updatedSettings);
    try {
      await updateSettingByKey(key, String(value));

      switch (key) {
        case EKeySetting.ENABLE_NOTIFICATIONS:
          if (value === true) {
            await enableAllNotifications();
            // Afficher un toast au lieu d'une notification
            showToast("Notifications activées 🔔", "success");
          } else {
            await removeAllNotifications();
            // Afficher un toast au lieu d'une notification
            showToast("Notifications désactivées 🔕", "info");
          }
          break;
        default:
          break;
      }

    } catch (error) {
      console.error("Failed to update setting:", error);
    }
  };

  return <ScreenView>
    <ScrollView>
      <Container style={{ paddingVertical: 20, gap: 36 }}>
        <Text style={[styles.text, styles.textCenter]}>Paramètres et activité</Text>
        <View style={[styles.row, styles.space, { justifyContent: 'space-between' }]}>
          {settings.map(setting =>
            <React.Fragment key={setting.id}>
              <Row>
                {setting.getIconIdentifier() && <DynamicIcon name={setting.getIconIdentifier()!} size={18} color={COLORS.primary} />}
                <Text style={styles.text}>{setting.label}</Text>
              </Row>
              <SettingInput setting={setting} onValueChange={(value) => handleSettingChange(setting.key, value)} />
            </React.Fragment>
          )}
        </View>
        <View style={[styles.row, styles.space, { justifyContent: 'space-between' }]}>
          <Row>
            <BookIcon size={18} color={COLORS.primary} />
            <Text style={styles.text}>Archive</Text>
          </Row>
          <TouchableOpacity
            onPress={() => {
              router.push('/archived-item');
            }}
          >
            <ArrowIcon size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </Container>
    </ScrollView>

    {/* Toast component */}
    <Toast
      visible={toast.visible}
      message={toast.message}
      type={toast.type}
      onHide={hideToast}
    />
  </ScreenView>;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: SIZES.padding.xs,
  },
  text: {
    fontSize: SIZES.font.l,
    fontWeight: SIZES.font.weight.semiBold,
    fontFamily: SIZES.font.familly.default,
  },
  textCenter: {
    textAlign: 'center',
  },
  space: {
    marginBottom: SIZES.padding.m,
  },
});

export default Settings;
