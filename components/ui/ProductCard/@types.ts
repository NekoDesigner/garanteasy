export interface IProductCardProps {
  style?: object;
  testID?: string;
  image?: string | { uri: string } | number; // string for file URIs, {uri: string} for remote URIs, number for require()
  brand: string;
  name: string;
  purchaseDate: Date | string;
  warrantyDuration: string;
}