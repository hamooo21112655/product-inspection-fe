import { useState, useMemo, useContext } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InspectionControlForm } from "@/components/inspections/InspectionControlForm";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { Inspection } from "@/types";
import {
  Plus,
  Pencil,
  Trash2,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ProductContext } from "@/contexts/ProductContext";
import { InspectionBodyContext } from "@/contexts/InspectionBodyContext";
import { InspectionContext } from "@/contexts/InspectionContext";

export default function Inspections() {
  const { inspections, addInspection, updateInspection, deleteInspection } =
    useContext(InspectionContext);

  const { products } = useContext(ProductContext);
  const { inspectionBodies } = useContext(InspectionBodyContext);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] =
    useState<Inspection | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const handleCreate = () => {
    setSelectedInspection(null);
    setMode("create");
    setFormOpen(true);
  };

  const handleEdit = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setDeleteOpen(true);
  };

  const handleSubmit = (data: Omit<Inspection, "id" | "createdAt">) => {
    if (mode === "create") {
      addInspection(data);
      toast.success("Inspekcijska kontrola uspješno dodana");
    } else if (selectedInspection) {
      updateInspection(selectedInspection.id, data);
      toast.success("Inspekcijska kontrola uspješno izmijenjena");
    }
  };

  const confirmDelete = () => {
    if (selectedInspection) {
      deleteInspection(selectedInspection.id);
      toast.success("Inspekcijska kontrola uspješno obrisana");
      setDeleteOpen(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Inspekcijske kontrole"
        description="Evidencija izvršenih inspekcijskih kontrola"
        actions={
          products.length > 0 &&
          inspectionBodies.length > 0 && (
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj kontrolu
            </Button>
          )
        }
      />

      <div className="p-6">
        <div className="card-section overflow-hidden">
          {inspections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ClipboardCheck className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-lg mb-2">
                Nema evidentiranih kontrola
              </h3>
              {products.length > 0 && inspectionBodies.length > 0 ? (
                <p className="text-muted-foreground mb-4">
                  Počnite dodavanjem prve inspekcijske kontrole
                </p>
              ) : (
                <p className="text-muted-foreground mb-4">
                  Da biste dodali inspekcijsku kontrolu najprije dodajte
                  proizvode i inspekcijska tijela
                </p>
              )}
              {products.length > 0 && inspectionBodies.length > 0 && (
                <Button onClick={handleCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Dodaj kontrolu
                </Button>
              )}
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Proizvod</th>
                  <th>Inspekcijsko tijelo</th>
                  <th>Status</th>
                  <th>Rezultati</th>
                  <th className="w-32">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {inspections.map((inspection) => (
                  <tr key={inspection.id}>
                    <td className="font-medium">
                      {format(
                        new Date(inspection.inspectionDate),
                        "dd.MM.yyyy",
                      )}
                    </td>
                    <td>
                      <p className="font-medium">
                        {
                          products.find(
                            (product) => product.id === inspection.productId,
                          )?.name
                        }
                      </p>
                    </td>
                    <td>
                      <p className="font-medium">
                        {
                          inspectionBodies.find(
                            (inspectionBody) =>
                              inspectionBody.id === inspection.inspectionBodyId,
                          )?.name
                        }
                      </p>
                    </td>
                    <td>
                      <Badge
                        className={
                          inspection.productSafe
                            ? "status-safe"
                            : "status-unsafe"
                        }
                      >
                        {inspection.productSafe ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Siguran
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" /> Nesiguran
                          </>
                        )}
                      </Badge>
                    </td>
                    <td className="max-w-xs truncate text-sm text-muted-foreground">
                      {inspection.result.substring(0, 10)}
                      {inspection.result.length > 10 ? "..." : ""}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(inspection)}
                          title="Izmijeni"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(inspection)}
                          title="Obriši"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <InspectionControlForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        selectedInspection={selectedInspection || undefined}
        mode={mode}
        inspectionBodies={inspectionBodies}
        products={products}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        title="Obriši inspekcijsku kontrolu"
        description="Da li ste sigurni da želite obrisati ovu inspekcijsku kontrolu? Ova akcija se ne može poništiti."
      />
    </MainLayout>
  );
}
