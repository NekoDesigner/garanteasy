import * as React from "react";
import Svg, { Path } from "react-native-svg";

import { COLORS } from "../../../constants";
import { IconProps } from "./@types";

const DEFAULT_PROPS = {
  size: 24,
  color: COLORS.light,
};

function LeftArrowIcon({
  size = DEFAULT_PROPS.size,
  color = DEFAULT_PROPS.color,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${DEFAULT_PROPS.size} ${DEFAULT_PROPS.size}`}
      fill="none"
      {...props}
    >
      <Path
        d="M9 18l6-6-6-6"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default LeftArrowIcon;