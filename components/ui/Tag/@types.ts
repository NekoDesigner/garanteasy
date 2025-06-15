export interface ITagProps {
  label: string;
  size?: 'small' | 'normal';
  style?: object;
  textStyle?: object;
  icon?: React.ReactNode;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  testID?: string;
}
