import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useDynamicSize } from "../../../hooks/useDynamicSize";
import { IconProps } from "./@types";

const DEFAULT_PROPS = {
  width: 60,
  height: 50,
  color: "#fff",
};

function GardenIcon({ color = DEFAULT_PROPS.color, size, ...props }: IconProps) {
  const { width, height } = useDynamicSize(
    DEFAULT_PROPS.width,
    DEFAULT_PROPS.height,
    size
      ? size
      : DEFAULT_PROPS.width);
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${DEFAULT_PROPS.width} ${DEFAULT_PROPS.height}`}
      fill="none"
      {...props}
    >
      <Path
        d="M52.8 35.331c3.977 0 7.2 3.273 7.2 7.31 0 4.037-3.224 7.31-7.2 7.31s-7.2-3.273-7.2-7.31c0-4.037 3.224-7.31 7.2-7.31zm0 5.716c-.994 0-1.8.818-1.8 1.828 0 1.009.806 1.827 1.8 1.827s1.8-.818 1.8-1.828c0-1.009-.806-1.827-1.8-1.827z"
        fill={color}
      />
      <Path
        d="M9 .049c.2-.203.84.122 1.8 3.046.96 2.924 4.8 15.838 6.6 21.93l25.8 3.045c1.6.203 5.04 1.462 6 4.873-3.6 1.219-9.84 5.605-6 13.402H20.4c1.2-3.249 1.56-10.478-6.6-13.401v-6.092l-6-23.148H2.4C1.6 3.5 0 2.85 0 1.876 0 .658 1.2.05 2.4.05H9zm16.8 38.937c-.994 0-1.8.819-1.8 1.828 0 1.01.806 1.827 1.8 1.827h10.8c.994 0 1.8-.818 1.8-1.827 0-1.01-.806-1.828-1.8-1.828H25.8zm0-23.1c4 .204 12.6.61 14.4 1.828 1.786 1.21 2.4 4.874 2.4 6.701L21 21.98c-.96-4.874 2.8-6.092 4.8-6.092z"
        fill={color}
      />
      <Path
        d="M10.8 35.38c3.976 0 7.2 3.273 7.2 7.31 0 4.037-3.223 7.31-7.2 7.31-3.976 0-7.2-3.273-7.2-7.31 0-4.037 3.224-7.31 7.2-7.31zm0 5.716c-.994 0-1.8.818-1.8 1.827 0 1.01.806 1.828 1.8 1.828s1.8-.819 1.8-1.828c0-1.009-.806-1.827-1.8-1.827z"
        fill={color}
      />
    </Svg>
  );
}

export default GardenIcon;
