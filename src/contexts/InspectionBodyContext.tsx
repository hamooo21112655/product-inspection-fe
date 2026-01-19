import {
  createInspectionBody,
  deleteInspectionBody,
  getInspectionBodies,
  InspectionBodyCreateDto,
  updateInspectionBody,
} from "@/api/inspection-bodies";
import { InspectionBody } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode } from "react";

type InspectionBodyContextType = {
  inspectionBodies: InspectionBody[];
  addInspectionBody: (inspectionBody: InspectionBodyCreateDto) => void;
  updateInspectionBody: (
    id: number,
    inspectionBody: InspectionBodyCreateDto,
  ) => void;
  deleteInspectionBody: (id: number) => void;
};

export const InspectionBodyContext = createContext<
  InspectionBodyContextType | undefined
>(undefined);

export function InspectionBodyProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: inspectionBodies = [] } = useQuery({
    queryKey: ["inspection-bodies"],
    queryFn: getInspectionBodies,
  });

  const createMutation = useMutation({
    mutationFn: createInspectionBody,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["inspection-bodies"] }),
    onError: (err) => {
      console.log("POST ERROR", err);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: InspectionBodyCreateDto }) =>
      updateInspectionBody(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["inspection-bodies"] }),
    onError: (err) => {
      console.log("UPDATE ERROR", err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteInspectionBody(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["inspection-bodies"] }),
    onError: (err) => {
      console.log("DELETE ERROR", err);
    },
  });

  return (
    <InspectionBodyContext.Provider
      value={{
        inspectionBodies,
        addInspectionBody: (data) => createMutation.mutate(data),
        updateInspectionBody: (id, data) => updateMutation.mutate({ id, data }),
        deleteInspectionBody: (id) => deleteMutation.mutate({ id }),
      }}
    >
      {children}
    </InspectionBodyContext.Provider>
  );
}
