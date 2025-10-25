export interface IProductCardProps {
  style?: object;
  testID?: string;
  image?: string | { uri: string } | null; // string for file URIs, {uri: string} for remote URIs, number for require()
  brand: string;
  name: string;
  onPress?: () => void;
  purchaseDate: Date | string;
  warrantyDuration: string;
}