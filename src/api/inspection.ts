import { Inspection, InspectionBody, Product } from "@/types";
import { apiFetch } from "./client";

export type InspectionCreateDto = {
  productId: number;
  inspectionBodyId: number;
  inspectionDate: Date;
  result: string;
  productSafe: boolean;
};

export function createInspection(data: InspectionCreateDto) {
  return apiFetch("/inspections", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      inspectionDate: data.inspectionDate.toLocaleDateString("en-CA"),
    }),
  });
}

export function getAllInspections(): Promise<Inspection[]> {
  return apiFetch("/inspections/all", {
    method: "GET",
  });
}

export function updateInspection(id: number, data: InspectionCreateDto) {
  return apiFetch(`/inspections/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      ...data,
      inspectionDate: data.inspectionDate.toLocaleDateString("en-CA"),
    }),
  });
}

export function deleteInspection(id: number) {
  return apiFetch(`/inspections/${id}`, {
    method: "DELETE",
  });
}
