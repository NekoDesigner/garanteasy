import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Chips from "../ui/Chips";
import { COLORS, SIZES } from "../ui/constants";

describe("Chips Components", () => {
  const BUTTONS_LIST = [
    {
      category: "hoursehold-electricals",
      text: "Électroménager",
    },
    {
      category: "small-electricals",
      text: "Petits appareils",
    },
    {
      category: "diy",
      text: "Bricolage",
    },
    {
      category: "garden",
      text: "Jardin",
    },
    {
      category: "fashion",
      text: "Mode",
    },
    {
      category: "other",
      text: "Autres",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  for (const button of BUTTONS_LIST) {
    it(`renders button for category: ${button.category}`, () => {
      const { getByText } = render(
        <Chips category={button.category} text={button.text} />
      );
      expect(getByText(button.text)).toBeTruthy();
    });
  }

  it("renders button with custom icon", () => {
    const customIcon = <div>Custom Icon</div>;
    const { getByText } = render(
      <Chips category={customIcon} text="Custom Category" />
    );
    expect(getByText("Custom Category")).toBeTruthy();
  });

  it("calls onPress when button is pressed", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Chips
        category="hoursehold-electricals"
        text="Électroménager"
        onPress={mockOnPress}
      />
    );
    const button = getByText("Électroménager");
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when button is disabled", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Chips
        category="hoursehold-electricals"
        text="Électroménager"
        onPress={undefined}
      />
    );
    const button = getByText("Électroménager");
    fireEvent.press(button);
    expect(mockOnPress).not.toHaveBeenCalled();
  });
  it("renders with small size", () => {
    const { getByTestId } = render(
      <Chips
        category="hoursehold-electricals"
        text="Électroménager"
        size="xs"
      />
    );
    const expected = getByTestId("category-icon").findByProps({
      color: COLORS.light,
    });
    expect(expected).toBeDefined();
    expect(expected.props.size).toBe(SIZES.icon.xs);
  });
  it("renders with default size", () => {
    const { getByTestId } = render(
      <Chips category="hoursehold-electricals" text="Électroménager" />
    );
    const expected = getByTestId("category-icon").findByProps({
      color: COLORS.light,
    });
    expect(expected).toBeDefined();
    expect(expected.props.size).toBe(SIZES.icon.s);
  });
  it("does not show icon when showIcon is false", () => {
    const { queryByTestId } = render(
      <Chips
        category="hoursehold-electricals"
        text="Électroménager"
        showIcon={false}
      />
    );
    const icon = queryByTestId("category-icon");
    expect(icon).toBeNull();
  });
});
