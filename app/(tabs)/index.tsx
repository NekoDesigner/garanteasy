import { SafeAreaView } from "react-native";
import Chips from "../../components/ui/Chips";

const HomeScreen = () => {
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
        label="Électroménager"
        onPress={() => {
          console.log("Électroménager");
        }}
      />
      <Chips
        category="hoursehold-electricals"
        label="Électroménager"
        size="xs"
      />
      <Chips
        showIcon={false}
        category="hoursehold-electricals"
        label="Petit électroménager"
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
