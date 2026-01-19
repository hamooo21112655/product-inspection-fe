import { Inspectorate } from "@/enums/inspectorate";
import { Jurisdiction } from "@/enums/jurisdiction";

export interface Product {
  id: number;
  name: string;
  manufacturer: string;
  serialNumber?: string;
  countryOrigin: string;
  description?: string;
  createdAt: Date;
}

export interface InspectionBody {
  id: number;
  name: string;
  inspectorate: Inspectorate;
  jurisdiction: Jurisdiction;
  contactPerson: string;
  createdAt: Date;
}
