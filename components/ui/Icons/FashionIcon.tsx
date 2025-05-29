import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { COLORS } from "../../../constants";
import { IconProps } from "./@types";

const DEFAULT_PROPS = {
  size: 60,
  color: COLORS.light,
};

function FashionIcon({
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
        d="M24.929 19.454c0-1.759 1.042-5.806 5.212-6.158 4.17-.351 6.515 3.52 6.08 5.719-.29 1.466-.434 3.518-6.08 4.838v4.839m0 0l25.625 13.196c1.593 1.026 3.822 3.43 0 4.838H4.516c-1.593-.587-3.997-2.375-.87-4.838l26.495-13.196z"
        stroke={color}
        strokeWidth={3}
      />
    </Svg>
  );
}

export default FashionIcon;
