import * as React from "react";
import Svg, { Defs, Path, Circle } from "react-native-svg";

interface ScanIconProps {
  width?: number | string;
  height?: number | string;
  [key: string]: any;
}

function ScanIllustrationComponent({ width = 600, height = 600, ...props }: ScanIconProps) {
  return (
    <Svg
      id="Calque_5"
      data-name="Calque 5"
      viewBox="235 210 580 610"
      width={width}
      height={height}
      {...props}
    >
      <Defs></Defs>
      {/* Main document rectangle */}
      <Path
        d="M318.49 226.2H784.35V803.54H318.49z"
        fill="#fff"
        stroke="#1d1d1b"
        strokeWidth="16"
        strokeMiterlimit={10}
      />
      {/* Header blue rectangle */}
      <Path
        d="M397.99 295.52H709.4V368.75H397.99z"
        fill="#228de0"
        stroke="#06326b"
        strokeWidth="12"
        strokeMiterlimit={10}
      />
      {/* Blue line */}
      <Path
        d="M394.69 422.2L547.76 422.2"
        fill="none"
        stroke="#228de0"
        strokeWidth="16"
        strokeMiterlimit={10}
      />
      {/* Content lines */}
      <Path
        fill="none"
        stroke="#a7b3bf"
        strokeWidth="16"
        strokeMiterlimit={10}
        d="M397.99 537L712.7 537"
      />
      <Path
        fill="none"
        stroke="#a7b3bf"
        strokeWidth="16"
        strokeMiterlimit={10}
        d="M504.42 584.17L579.31 584.17"
      />
      <Path
        fill="none"
        stroke="#a7b3bf"
        strokeWidth="16"
        strokeMiterlimit={10}
        d="M583.54 680.37L658.42 680.37"
      />
      <Path
        fill="none"
        stroke="#a7b3bf"
        strokeWidth="16"
        strokeMiterlimit={10}
        d="M675.26 680.37L709.4 680.37"
      />
      <Path
        fill="none"
        stroke="#a7b3bf"
        strokeWidth="16"
        strokeMiterlimit={10}
        d="M396.34 729.39L430.49 729.39"
      />
      <Path
        fill="none"
        stroke="#a7b3bf"
        strokeWidth="16"
        strokeMiterlimit={10}
        d="M450.27 729.39L484.41 729.39"
      />
      <Path
        fill="none"
        stroke="#a7b3bf"
        strokeWidth="16"
        strokeMiterlimit={10}
        d="M504.42 729.39L538.57 729.39"
      />
      <Path
        fill="none"
        stroke="#a7b3bf"
        strokeWidth="16"
        strokeMiterlimit={10}
        d="M558.35 729.39L592.49 729.39"
      />
      <Path
        fill="none"
        stroke="#a7b3bf"
        strokeWidth="16"
        strokeMiterlimit={10}
        d="M636.17 584.17L711.05 584.17"
      />
      <Path
        fill="none"
        stroke="#a7b3bf"
        strokeWidth="16"
        strokeMiterlimit={10}
        d="M396.34 584.17L471.23 584.17"
      />
      <Path
        fill="none"
        stroke="#a7b3bf"
        strokeWidth="16"
        strokeMiterlimit={10}
        d="M396.34 479.6L711.05 479.6"
      />
      <Path
        fill="none"
        stroke="#a7b3bf"
        strokeWidth="16"
        strokeMiterlimit={10}
        d="M394.69 631.34L709.4 631.34"
      />
      <Path
        fill="none"
        stroke="#a7b3bf"
        strokeWidth="16"
        strokeMiterlimit={10}
        d="M394.69 680.37L569.9 680.37"
      />
      {/* Scanner line */}
      <Path
        fill="#21a3f0"
        stroke="#19a2ec"
        strokeMiterlimit={10}
        d="M270.73 460.5H846.44V476.01H270.73z"
      />
      {/* Scanner dot */}
      <Circle
        fill="#21a3f0"
        stroke="#19a2ec"
        strokeMiterlimit={10}
        cx={251.41}
        cy={468.26}
        r={7.41}
      />
    </Svg>
  );
}

export default ScanIllustrationComponent;