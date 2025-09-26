import { ReactNode } from "react";

export interface ICustomAlertProps {
  children: ReactNode;
  onClose?: () => void;
  visible?: boolean;
}

export interface ICustomAlertActionProps {
  label: string;
  onPress: () => void;
  type?: "primary" | "secondary" | "danger" | "emerald" | "outline-primary" | "outline-secondary" | "outline-danger" | "outline-emerald";
  buttonStyle?: object;
  textStyle?: object;
  disabled?: boolean;
}

export type TCustomAlertActionType = ICustomAlertActionProps["type"];