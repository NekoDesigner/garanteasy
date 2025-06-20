export interface IProductCardProps {
  style?: object;
  testID?: string;
  image?: string | { uri: string };
  brand: string;
  name: string;
  purchaseDate: Date | string;
  warrantyDuration: string;

}