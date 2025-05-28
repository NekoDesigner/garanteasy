import { SafeAreaView } from "react-native";
import Chips from "../../components/ui/Chips";

export default function HomeScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Chips
        category="hoursehold-electricals"
        text="Électroménager"
        onPress={() => {
          console.log("Électroménager");
        }}
      />
      <Chips
        category="hoursehold-electricals"
        text="Électroménager"
        size="xs"
        onPress={() => {
          console.log("Électroménager");
        }}
      />
      <Chips
        showIcon={false}
        category="hoursehold-electricals"
        text="Petit électroménager"
        onPress={() => {
          console.log("Électroménager");
        }}
      />
    </SafeAreaView>
  );
}
