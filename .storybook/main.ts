import { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: [
    '../components/**/*.stories.@(js|jsx|ts|tsx)', // Adjust path as needed
  ],
  addons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
};

export default main;
