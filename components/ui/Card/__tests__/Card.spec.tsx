import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import ScanIcon from "../../Icons/ScanIcon";
import Card from "../index";
import CardStyles from "../styles";

describe("Card Components", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

    test('renders correctly', () => {
      const tree = render(<Card>
        <Text>Test Card</Text>
        <ScanIcon />
      </Card>).toJSON();
      expect(tree).toMatchSnapshot();
    });

  it('renders with custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(
      <Card style={customStyle} testID="custom-card">
        <Text>Custom Styled Card</Text>
      </Card>
    );
    const card = getByTestId('custom-card');
    expect(card.props.style).toContainEqual(customStyle);
  });

  it('renders with default testID', () => {
    const { getByTestId } = render(
      <Card>
        <Text>Default TestID Card</Text>
      </Card>
    );
    const card = getByTestId('card');
    expect(card).toBeTruthy();
  });

  it('applies text styles to Text children', () => {
    const { getByText } = render(
      <Card>
        <Text>Styled Text</Text>
      </Card>
    );
    const textElement = getByText('Styled Text');
    expect(textElement.props.style).toContainEqual(CardStyles.text);
  });
});