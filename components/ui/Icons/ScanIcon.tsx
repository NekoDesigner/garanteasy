import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { COLORS } from "../../../constants";
import { IconProps } from "./@types";

const DEFAULT_PROPS = {
  size: 24,
  color: COLORS.light
};

function ScanIcon({ size = DEFAULT_PROPS.size, color = DEFAULT_PROPS.color, ...props }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${DEFAULT_PROPS.size} ${DEFAULT_PROPS.size}`}
      fill="none"
      {...props}
    >
      <Path
        d="M2.75 14a.75.75 0 01.75.75v2.5a3.25 3.25 0 003.25 3.25h2.5a.75.75 0 010 1.5h-2.5A4.75 4.75 0 012 17.25v-2.5a.75.75 0 01.75-.75zm18.5 0a.75.75 0 01.75.75v2.5A4.75 4.75 0 0117.25 22h-2.5a.75.75 0 010-1.5h2.5a3.25 3.25 0 003.25-3.25v-2.5a.75.75 0 01.75-.75zm-7-7A2.75 2.75 0 0117 9.75v4.5A2.75 2.75 0 0114.25 17h-4.5A2.75 2.75 0 017 14.25v-4.5A2.75 2.75 0 019.75 7h4.5zm-4.5 1.5c-.69 0-1.25.56-1.25 1.25v4.5c0 .69.56 1.25 1.25 1.25h4.5c.69 0 1.25-.56 1.25-1.25v-4.5c0-.69-.56-1.25-1.25-1.25h-4.5zM9.25 2a.75.75 0 010 1.5h-2.5A3.25 3.25 0 003.5 6.75v2.5a.75.75 0 01-1.5 0v-2.5A4.75 4.75 0 016.75 2h2.5zm8 0A4.75 4.75 0 0122 6.75v2.5a.75.75 0 01-1.5 0v-2.5a3.25 3.25 0 00-3.25-3.25h-2.5a.75.75 0 010-1.5h2.5z"
        fill={color}
      />
    </Svg>
  );
}

export default ScanIcon;
