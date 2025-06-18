import { render, fireEvent } from "@testing-library/react-native";
import React from "react";
import ScanIcon from "../../Icons/ScanIcon";
import { IButtonProps } from "../@types";
import Button from "../index";

describe("Button Components", () => {

  const BUTTON_LIST: IButtonProps[] = [
    {
      label: "Default Button",
      variant: "primary",
      showIcon: true,
      icon: <ScanIcon />,
      onPress: () => console.log("Default Button Pressed"),
    },
    {
      label: "Secondary Button",
      variant: "secondary",
      showIcon: true,
      icon: <ScanIcon />,
      onPress: () => console.log("Secondary Button Pressed"),
    },
    {
      label: "Danger Button",
      variant: "danger",
      showIcon: true,
      icon: <ScanIcon />,
      onPress: () => console.log("Danger Button Pressed"),
    },
    {
      label: "Outline Primary Button",
      variant: "outline-primary",
      showIcon: true,
      icon: <ScanIcon />,
      onPress: () => console.log("Outline Primary Button Pressed"),
    },
    {
      label: "Outline Secondary Button",
      variant: "outline-secondary",
      showIcon: true,
      icon: <ScanIcon />,
      onPress: () => console.log("Outline Secondary Button Pressed"),
    },
    {
      label: "Outline Danger Button",
      variant: "outline-danger",
      showIcon: true,
      icon: <ScanIcon />,
      onPress: () => console.log("Outline Danger Button Pressed"),
    },
    {
      label: "Disabled Button",
      variant: "primary",
      disabled: true,
      showIcon: true,
      icon: <ScanIcon />,
      onPress: () => console.log("Disabled Button Pressed"),
    },
    {
      label: "Link Primary Button",
      variant: "link-primary",
      disabled: false,
      showIcon: true,
      icon: <ScanIcon />,
      onPress: () => console.log("Link Button Pressed"),
    },
    {
      label: "Link Secondary Button",
      variant: "link-secondary",
      disabled: false,
      showIcon: true,
      icon: <ScanIcon />,
      onPress: () => console.log("Link Button Pressed"),
    },
    {
      label: "Link Danger Button",
      variant: "link-danger",
      disabled: false,
      showIcon: true,
      icon: <ScanIcon />,
      onPress: () => console.log("Link Button Pressed"),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  for (const button of BUTTON_LIST) {
    it(`renders button: ${button.label}`, () => {
      const { getByText } = render(
        <Button
          label={button.label}
          variant={button.variant}
          showIcon={button.showIcon}
          icon={button.icon}
          onPress={button.onPress}
          disabled={button.disabled}
        />
      );
      expect(getByText(button.label)).toBeTruthy();
    });

    test('renders correctly', () => {
      const tree = render(<Button
        label={button.label}
        variant={button.variant}
        showIcon={button.showIcon}
        icon={button.icon}
        onPress={button.onPress}
        disabled={button.disabled}
      />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it(`calls onPress when button is pressed ${button.label}`, () => {
        const mockOnPress = jest.fn();
      const { getByText } = render(
        <Button
          label={button.label}
          variant={button.variant}
          showIcon={button.showIcon}
          icon={button.icon}
          onPress={mockOnPress}
          disabled={button.disabled}
        />
      );
      const buttonElement = getByText(button.label);
      fireEvent.press(buttonElement);
      if (button.disabled) {
        expect(mockOnPress).not.toHaveBeenCalled();
      } else {
        expect(mockOnPress).toHaveBeenCalledTimes(1);
      }
    });
  }
});