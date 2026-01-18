export interface Product {
  id: number;
  name: string;
  manufacturer: string;
  serialNumber?: string;
  countryOrigin: string;
  description?: string;
  createdAt: Date;
}
