import {
  createInspection,
  deleteInspection,
  getAllInspections,
  InspectionCreateDto,
  updateInspection,
} from "@/api/inspection";
import { Inspection } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode } from "react";

type InspectionContextType = {
  inspections: Inspection[];
  addInspection: (inspection: InspectionCreateDto) => void;
  updateInspection: (id: number, inspection: InspectionCreateDto) => void;
  deleteInspection: (id: number) => void;
};

export const InspectionContext = createContext<
  InspectionContextType | undefined
>(undefined);

export function InspectionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: inspections = [] } = useQuery({
    queryKey: ["inspections"],
    queryFn: getAllInspections,
  });

  const createMutation = useMutation({
    mutationFn: createInspection,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["inspections"] }),
    onError: (err) => {
      console.log("POST ERROR", err);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: InspectionCreateDto }) =>
      updateInspection(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["inspections"] }),
    onError: (err) => {
      console.log("UPDATE ERROR", err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteInspection(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["inspections"] }),
    onError: (err) => {
      console.log("DELETE ERROR", err);
    },
  });

  return (
    <InspectionContext.Provider
      value={{
        inspections,
        addInspection: (data) => createMutation.mutate(data),
        updateInspection: (id, data) => updateMutation.mutate({ id, data }),
        deleteInspection: (id) => deleteMutation.mutate({ id }),
      }}
    >
      {children}
    </InspectionContext.Provider>
  );
}
