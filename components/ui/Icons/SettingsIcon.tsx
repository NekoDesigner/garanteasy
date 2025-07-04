/**
* SettingsIcon - Generated by Garanteasier CLI
*/

import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { COLORS } from "../../../constants";
import { IconProps } from "./@types";

const DEFAULT_PROPS = {
  size: 24,
  color: COLORS.light,
};

// TODO: create tests for this SettingsIcon component
function SettingsIcon ({
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
        d="M9.25 22l-.4-3.2a3.79 3.79 0 01-.612-.3 8.266 8.266 0 01-.563-.375L4.7 19.375l-2.75-4.75 2.575-1.95a2.387 2.387 0 01-.025-.338v-.675c0-.108.009-.22.025-.337L1.95 9.375l2.75-4.75 2.975 1.25c.184-.133.375-.258.575-.375.2-.117.4-.217.6-.3l.4-3.2h5.5l.4 3.2c.217.083.421.183.613.3.191.117.379.242.562.375l2.975-1.25 2.75 4.75-2.575 1.95c.017.117.025.23.025.338v.675c0 .108-.017.22-.05.337l2.575 1.95-2.75 4.75-2.95-1.25a6.826 6.826 0 01-.575.375c-.2.117-.4.217-.6.3l-.4 3.2h-5.5zm2.8-6.5c.967 0 1.792-.342 2.475-1.025A3.372 3.372 0 0015.55 12c0-.967-.341-1.792-1.025-2.475A3.372 3.372 0 0012.05 8.5c-.983 0-1.812.342-2.487 1.025A3.393 3.393 0 008.55 12c0 .967.338 1.792 1.013 2.475.675.683 1.504 1.025 2.487 1.025z"
        fill={color}
      />
    </Svg>
  );
}

export default SettingsIcon;
