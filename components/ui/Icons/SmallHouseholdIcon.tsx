import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { COLORS } from "../../../constants";
import { IconProps } from "./@types";

const DEFAULT_PROPS = {
  size: 60,
  color: COLORS.light,
};

// TODO: create tests for this SmallHouseholdIcon component
function SmallHouseholdIcon({ size = DEFAULT_PROPS.size, color = DEFAULT_PROPS.color, ...props }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${DEFAULT_PROPS.size} ${DEFAULT_PROPS.size}`}
      fill="none"
      {...props}
    >
      <Path
        d="M44.4 12c4.473 0 8.232 3.06 9.298 7.2H58.2a1.8 1.8 0 010 3.6H54v18a4.802 4.802 0 01-3.6 4.649V48h-7.2v-2.4H16.8V48H9.6v-2.551A4.802 4.802 0 016 40.8v-18H1.8a1.8 1.8 0 010-3.6h4.502C7.368 15.06 11.127 12 15.6 12h28.8zm-25.2 2.4a1.2 1.2 0 000 2.4h21.6a1.2 1.2 0 000-2.4H19.2z"
        fill={color}
      />
    </Svg>
  );
}

export default SmallHouseholdIcon;
