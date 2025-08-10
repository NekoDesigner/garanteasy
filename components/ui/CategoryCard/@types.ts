import { PropsWithChildren } from 'react';
export interface ICardProps extends PropsWithChildren {
  style?: object;
  testID?: string;
  onPress?: () => void;
}