import { getInspectionsPaginated } from "@/api/report";
import { Report } from "@/types";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useState } from "react";

interface ReportFilters {
  inspectionBodyId: number;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

type ReportContextType = {
  report: any;
  filters: ReportFilters;
  setFilters: (filters: ReportFilters) => void;
};

export const ReportContext = createContext<ReportContextType | undefined>(
  undefined,
);

export function ReportProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<ReportFilters>({
    inspectionBodyId: 14,
    page: 1,
    limit: 10,
  });

  const { data: report = [] } = useQuery({
    queryKey: ["report", filters],
    queryFn: () => getInspectionsPaginated(filters),
  });

  return (
    <ReportContext.Provider
      value={{
        report,
        filters,
        setFilters,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}
