import { useContext, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InspectionBodyForm } from "@/components/inspection-bodies/InspectionBodyForm";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { InspectionBody } from "@/types";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { InspectionBodyContext } from "@/contexts/InspectionBodyContext";
import { Inspectorate } from "@/enums/inspectorate";
import { Jurisdiction } from "@/enums/jurisdiction";

export default function InspectionBodies() {
  const {
    inspectionBodies,
    addInspectionBody,
    updateInspectionBody,
    deleteInspectionBody,
  } = useContext(InspectionBodyContext);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBody, setSelectedBody] = useState<InspectionBody | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const handleCreate = () => {
    setSelectedBody(null);
    setMode("create");
    setFormOpen(true);
  };

  const handleEdit = (body: InspectionBody) => {
    setSelectedBody(body);
    setMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (body: InspectionBody) => {
    setSelectedBody(body);
    setDeleteOpen(true);
  };

  const handleSubmit = (data: Omit<InspectionBody, "id" | "createdAt">) => {
    if (mode === "create") {
      addInspectionBody(data);
      toast.success("Inspekcijsko tijelo uspješno dodano");
    } else if (selectedBody) {
      updateInspectionBody(selectedBody.id, data);
      toast.success("Inspekcijsko tijelo uspješno izmijenjeno");
    }
  };

  const confirmDelete = () => {
    if (selectedBody) {
      deleteInspectionBody(selectedBody.id);
      toast.success("Inspekcijsko tijelo uspješno obrisano");
      setDeleteOpen(false);
    }
  };

  const getInspektoratColor = (inspectorate: Inspectorate) => {
    switch (inspectorate) {
      case Inspectorate.FBIH:
        return "bg-blue-100 text-blue-800";
      case Inspectorate.RS:
        return "bg-red-100 text-red-800";
      case Inspectorate.DISTRICT_BRCKO:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Inspekcijska tijela"
        description="Evidencija registrovanih inspekcijskih tijela u BiH"
        actions={
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Dodaj inspekcijsko tijelo
          </Button>
        }
      />

      <div className="p-6">
        <div className="card-section overflow-hidden">
          {inspectionBodies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-lg mb-2">
                Nema evidentiranih inspekcijskih tijela
              </h3>
              <p className="text-muted-foreground mb-4">
                Počnite dodavanjem prvog inspekcijskog tijela
              </p>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Dodaj inspekcijsko tijelo
              </Button>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Naziv</th>
                  <th>Inspektorat</th>
                  <th>Nadležnost</th>
                  <th>Kontakt osoba</th>
                  <th className="w-24">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {inspectionBodies.map((body) => (
                  <tr key={body.id}>
                    <td className="font-medium">{body.name}</td>
                    <td>
                      <Badge className={getInspektoratColor(body.inspectorate)}>
                        {body.inspectorate === Inspectorate.DISTRICT_BRCKO
                          ? "Distrikt Brčko"
                          : body.inspectorate}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant="outline">
                        {body.jurisdiction === Jurisdiction.MARKET_INSPECTION
                          ? "Tržišna inspekcija"
                          : "Zdravstveno-sanitarna inspekcija"}
                      </Badge>
                    </td>
                    <td>{body.contactPerson}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(body)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(body)}
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

      <InspectionBodyForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        selectedBody={selectedBody || undefined}
        mode={mode}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        title="Obriši inspekcijsko tijelo"
        description={`Da li ste sigurni da želite obrisati inspekcijsko tijelo "${selectedBody?.name}"? Ova akcija će obrisati sve inspekcijske kontrole koje sadržavaju ovo inspekcijsko tijelo.`}
      />
    </MainLayout>
  );
}
