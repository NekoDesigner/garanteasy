import { render } from "@testing-library/react-native";
import React from "react";
import ScanIcon from "../../Icons/ScanIcon";
import { ITagProps } from "../@types";
import Tag from "../index";

describe("Tag Components", () => {

  const DEFAULT_TAG_PROPS: ITagProps = {
    label: "Default Tag",
    showIcon: true,
    icon: <ScanIcon />,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render tag correctly with default props', () => {
    const { getByTestId } = render(<Tag {...DEFAULT_TAG_PROPS} />);
    const tagElement = getByTestId('tag');
    const textElement = getByTestId('tag-text');
    const iconElement = getByTestId('tag-icon');
    expect(tagElement).toBeTruthy();
    expect(textElement).toBeTruthy();
    expect(iconElement).toBeTruthy();
    expect(textElement.props.children).toBe(DEFAULT_TAG_PROPS.label);
  });

  it('renders tag without icon when showIcon is false', () => {
    const { getByTestId, queryByTestId } = render(
      <Tag {...DEFAULT_TAG_PROPS} showIcon={false} />
    );
    const tagElement = getByTestId('tag');
    const textElement = getByTestId('tag-text');
    const iconElement = queryByTestId('tag-icon');
    expect(tagElement).toBeTruthy();
    expect(textElement).toBeTruthy();
    expect(iconElement).toBeNull(); // Icon should not be rendered
  });

  it('renders tag with custom style', () => {
    const customStyle = { backgroundColor: 'blue', padding: 10 };
    const { getByTestId } = render(
      <Tag {...DEFAULT_TAG_PROPS} style={customStyle} />
    );
    const tagElement = getByTestId('tag');
    expect(tagElement.props.style).toContainEqual(customStyle);
  });
  it('renders tag with custom text style', () => {
    const customTextStyle = { color: 'red', fontSize: 20 };
    const { getByTestId } = render(
      <Tag {...DEFAULT_TAG_PROPS} textStyle={customTextStyle} />
    );
    const textElement = getByTestId('tag-text');
    expect(textElement.props.style).toContainEqual(customTextStyle);
  });

    test('renders correctly', () => {
      const tree = render(<Tag label='Content' />).toJSON();
      expect(tree).toMatchSnapshot();
    });
});