import { apiFetch } from "./client";

export type GetInspectionsQueryDto = {
  inspectionBodyId: number;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};

export function getInspectionsPaginated(query: GetInspectionsQueryDto) {
  console.log("evo ga");
  const params = new URLSearchParams({
    inspectionBodyId: query.inspectionBodyId.toString(),
    page: (query.page || 1).toString(),
    limit: (query.limit || 10).toString(),
    from: query.from || "",
    to: query.to || "",
  });

  return apiFetch(`/inspections?${params.toString()}`, {
    method: "GET",
  });
}
