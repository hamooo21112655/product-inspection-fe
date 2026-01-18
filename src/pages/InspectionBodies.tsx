import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InspectionBodyForm } from '@/components/inspection-bodies/InspectionBodyForm';
import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog';
import { useDataStore } from '@/store/dataStore';
import { InspekcijskoTijelo } from '@/types';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export default function InspectionBodies() {
  const { inspekcijskaTijela, addInspekcijskoTijelo, updateInspekcijskoTijelo, deleteInspekcijskoTijelo } = useDataStore();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBody, setSelectedBody] = useState<InspekcijskoTijelo | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  const handleCreate = () => {
    setSelectedBody(null);
    setMode('create');
    setFormOpen(true);
  };

  const handleEdit = (body: InspekcijskoTijelo) => {
    setSelectedBody(body);
    setMode('edit');
    setFormOpen(true);
  };

  const handleDelete = (body: InspekcijskoTijelo) => {
    setSelectedBody(body);
    setDeleteOpen(true);
  };

  const handleSubmit = (data: Omit<InspekcijskoTijelo, 'id' | 'createdAt'>) => {
    if (mode === 'create') {
      addInspekcijskoTijelo(data);
      toast.success('Inspekcijsko tijelo uspješno dodano');
    } else if (selectedBody) {
      updateInspekcijskoTijelo(selectedBody.id, data);
      toast.success('Inspekcijsko tijelo uspješno izmijenjeno');
    }
  };

  const confirmDelete = () => {
    if (selectedBody) {
      deleteInspekcijskoTijelo(selectedBody.id);
      toast.success('Inspekcijsko tijelo uspješno obrisano');
      setDeleteOpen(false);
    }
  };

  const getInspektoratColor = (inspektorat: string) => {
    switch (inspektorat) {
      case 'FBiH': return 'bg-blue-100 text-blue-800';
      case 'RS': return 'bg-red-100 text-red-800';
      case 'Distrikt Brčko': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
          {inspekcijskaTijela.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-lg mb-2">Nema evidentiranih inspekcijskih tijela</h3>
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
                {inspekcijskaTijela.map((tijelo) => (
                  <tr key={tijelo.id}>
                    <td className="font-medium">{tijelo.naziv}</td>
                    <td>
                      <Badge className={getInspektoratColor(tijelo.inspektorat)}>
                        {tijelo.inspektorat}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant="outline">{tijelo.nadleznost}</Badge>
                    </td>
                    <td>{tijelo.kontaktOsoba}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(tijelo)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(tijelo)}
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
        initialData={selectedBody || undefined}
        mode={mode}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        title="Obriši inspekcijsko tijelo"
        description={`Da li ste sigurni da želite obrisati "${selectedBody?.naziv}"? Ova akcija se ne može poništiti.`}
      />
    </MainLayout>
  );
}
