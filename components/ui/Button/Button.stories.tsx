import React from "react";
import { View, Alert } from "react-native";
import ScanIcon from "../Icons/ScanIcon";
import { IButtonProps } from "./@types";
import Button from "./index";

export default {
  title: 'Button',
  component: Button
};

export const Default = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, gap: 24 }}>
      <Button
        label="Default Button"
        onPress={() => console.log("Default Button Pressed")}
      />
    </View>
);

const buttonVariants: IButtonProps[] = [
  { label: 'Primary Button', variant: 'primary', showIcon: true, icon: <ScanIcon />, onPress: () => Alert.alert('Primary Button Pressed') },
  { label: 'Secondary Button', variant: 'secondary', showIcon: true, icon: <ScanIcon />, onPress: () => Alert.alert('Secondary Button Pressed') },
  { label: 'Danger Button', variant: 'danger', showIcon: true, icon: <ScanIcon />, onPress: () => Alert.alert('Danger Button Pressed') },
  { label: 'Outline Primary Button', variant: 'outline-primary', showIcon: true, icon: <ScanIcon />, onPress: () => Alert.alert('Outline Primary Button Pressed') },
  { label: 'Outline Secondary Button', variant: 'outline-secondary', showIcon: true, icon: <ScanIcon />, onPress: () => Alert.alert('Outline Secondary Button Pressed') },
  { label: 'Outline Danger Button', variant: 'outline-danger', showIcon: true, icon: <ScanIcon />, onPress: () => Alert.alert('Outline Danger Button Pressed') },
  { label: 'Disabled Button', variant: 'primary', disabled: true, showIcon:true, icon: <ScanIcon />, onPress: () => Alert.alert('Disabled Button Pressed') },
  { label: 'Link Button', variant: 'link-primary', disabled: false, showIcon:true, icon: <ScanIcon />, onPress: () => Alert.alert('Link Button Pressed') },
  { label: 'Disbled Link Button', variant: 'link-secondary', disabled: true, showIcon:true, icon: <ScanIcon />, onPress: () => Alert.alert('Disabled Link Button Pressed') },
  { label: 'Icon Right Button', variant: 'link-danger', disabled: true, showIcon:true, iconPosition: 'right', icon: <ScanIcon />, onPress: () => Alert.alert('Icon Right Button Pressed') },
];

export const Variant = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, gap: 24 }}>
    {buttonVariants.map((props, idx) => (
      <Button key={idx} {...props} />
    ))}
  </View>
);
