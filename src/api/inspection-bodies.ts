import { InspectionBody, Product } from "@/types";
import { apiFetch } from "./client";
import { Inspectorate } from "@/enums/inspectorate";
import { Jurisdiction } from "@/enums/jurisdiction";

export type InspectionBodyCreateDto = {
  name: string;
  inspectorate: Inspectorate;
  jurisdiction: Jurisdiction;
  contactPerson: string;
};

export function createInspectionBody(data: InspectionBodyCreateDto) {
  return apiFetch("/inspection-bodies", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getInspectionBodies(): Promise<InspectionBody[]> {
  return apiFetch("/inspection-bodies", {
    method: "GET",
  });
}

export function updateInspectionBody(
  id: number,
  data: InspectionBodyCreateDto,
) {
  return apiFetch(`/inspection-bodies/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteInspectionBody(id: number) {
  return apiFetch(`/inspection-bodies/${id}`, {
    method: "DELETE",
  });
}
