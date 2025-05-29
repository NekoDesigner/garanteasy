import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { useDynamicSize } from "../../../hooks/useDynamicSize";
import { IconProps } from "./@types";

const DEFAULT_PROPS = {
  width: 60,
  height: 46,
  color: "#fff",
  color2: "#000",
};

function DIYIcon({ size, color, color2, ...props }: IconProps) {
  const sizeState = useDynamicSize(DEFAULT_PROPS.width, DEFAULT_PROPS.height, size);

  return (
    <Svg
      width={sizeState.width}
      height={sizeState.height}
      viewBox={`0 0 ${DEFAULT_PROPS.width} ${DEFAULT_PROPS.height}`}
      fill="none"
      {...props}
    >
      <Path
        d="M39.474 38l7.105-6.316 12.632-2.368v15.79H39.474V38zM22.105 4.053A3.158 3.158 0 0125.263.895h28.421A6.316 6.316 0 0160 7.21v6.315a6.316 6.316 0 01-6.316 6.316h-28.42a3.158 3.158 0 01-3.159-3.158V4.053z"
        fill={color || DEFAULT_PROPS.color}
      />
      <Path
        d="M36.316 19.067l8.787-7.12L59.38 29.57l-8.787 7.119-14.277-17.622z"
        fill={color || DEFAULT_PROPS.color}
      />
      <Path d="M37.895 23h6.316v1.579h-6.316V23z" fill="#D9D9D9" />
      <Path
        d="M0 10.368a.79.79 0 01.79-.79h11.052a.79.79 0 010 1.58H.79a.79.79 0 01-.789-.79z"
        fill={color2 || DEFAULT_PROPS.color2}
      />
      <Path
        d="M52.252 18.263h1.432v1.58H51.5l7.68 9.477.032-.004v.044l.17.21-.17.137v15.398H39.474V38l7.08-6.296-5.773-7.125h-2.886V23H39.5l-2.558-3.158h-11.68v-1.579h9.535l10.538-8.536 6.916 8.536zM50.36 38.91l-3.992-4.928-5.315 4.726v4.818h16.579V33.018L50.36 38.91zm-.924-6.157l1.39 1.714 3.17-2.569-4.56.855zM45.79 21.42v4.737h-1.696l3.086 3.807 9.105-1.707-5.539-6.837H45.79zM28.421 10.368a3.158 3.158 0 00-3.158-3.157h-1.579v6.315h1.58a3.158 3.158 0 003.157-3.158zm11.395 7.895h8.371l-3.318-4.095-5.053 4.095zm-8.237-7.895a6.316 6.316 0 01-6.316 6.316h-1.579c0 .872.707 1.58 1.58 1.58v1.578a3.158 3.158 0 01-3.159-3.158v-1.579H15.79v-1.579h4.737V7.211H15.79a3.15 3.15 0 00-2.526 1.265 2.363 2.363 0 010 3.783 3.15 3.15 0 002.526 1.267v1.58a4.738 4.738 0 01-4.671-3.948H.789a.79.79 0 010-1.58h10.33a4.737 4.737 0 014.67-3.946h6.316v-1.58A3.158 3.158 0 0125.263.896h28.421A6.316 6.316 0 0160 7.21v6.315a6.316 6.316 0 01-6.316 6.316v-1.579a4.737 4.737 0 004.737-4.737V7.211a4.737 4.737 0 00-4.737-4.737h-28.42a1.58 1.58 0 00-1.572 1.417l-.008.162h1.58a6.316 6.316 0 016.315 6.315z"
        fill={color || DEFAULT_PROPS.color}
      />
    </Svg>
  );
}

export default DIYIcon;
