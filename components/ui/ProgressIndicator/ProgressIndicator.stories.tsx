/**
 * ProgressIndicator - Generated by Garanteasier CLI
 */

import React from "react";
import { View, Text } from "react-native";
import ProgressIndicator from "./index";

export default {
  title: 'ProgressIndicator',
  component: ProgressIndicator
};

function TemplateProgressIndicatorAnimationComponent() {
  const [progress, setProgress] = React.useState(1);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev > 0 ? prev - 0.01 : 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);
  return (
    <View style={{ width: '60%', padding: 8, gap: 16 }}>
      <Text>Progress Animation {Math.floor(progress * 100)}%</Text>
      <ProgressIndicator value={progress} />
    </View>
  );
}

export const Default = () => (
  <View style={{ flex: 1, padding: 16, gap: 24, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <TemplateProgressIndicatorAnimationComponent />
  </View>
);