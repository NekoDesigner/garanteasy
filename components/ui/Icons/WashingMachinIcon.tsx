import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { COLORS, SIZES } from "../../../constants";

type Props = {
  className?: string;
  size?: number;
  color?: string;
  testID?: string;
};

function WashingMachinIcon({
  size = SIZES.icon.s,
  color = COLORS.light,
  ...props
}: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 62" fill="none" {...props}>
      <Path
        d="M57 53.705a7.364 7.364 0 01-7.364 7.363H10.364A7.364 7.364 0 013 53.705V18.114h54v35.59zM30 23.023c-8.134 0-14.727 6.593-14.727 14.727S21.866 52.477 30 52.477s14.727-6.593 14.727-14.727S38.134 23.023 30 23.023zm0 1.84c7.117 0 12.886 5.77 12.886 12.887 0 7.117-5.77 12.886-12.886 12.886-7.117 0-12.886-5.77-12.886-12.886 0-7.117 5.77-12.886 12.886-12.886zM49.636.932A7.364 7.364 0 0157 8.295v7.364H3V8.295A7.364 7.364 0 0110.364.932h39.272zM36.75 9.522a1.84 1.84 0 100 3.683h3.682a1.841 1.841 0 000-3.682H36.75zm9.818 0a1.84 1.84 0 100 3.683h3.682a1.841 1.841 0 000-3.682h-3.682z"
        fill={color}
      />
    </Svg>
  );
}

export default WashingMachinIcon;
