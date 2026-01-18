import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InspectionControlForm } from '@/components/controls/InspectionControlForm';
import { InspectionDetailDialog } from '@/components/controls/InspectionDetailDialog';
import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog';
import { useDataStore } from '@/store/dataStore';
import { InspekcijskaKontrola, InspekcijskaKontrolaDetalji } from '@/types';
import { Plus, Pencil, Trash2, ClipboardCheck, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function InspectionControls() {
  const { 
    inspekcijskeKontrole, 
    proizvodi, 
    inspekcijskaTijela,
    addInspekcijskaKontrola, 
    updateInspekcijskaKontrola, 
    deleteInspekcijskaKontrola 
  } = useDataStore();
  
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedControl, setSelectedControl] = useState<InspekcijskaKontrola | null>(null);
  const [selectedDetailControl, setSelectedDetailControl] = useState<InspekcijskaKontrolaDetalji | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  const kontroleDetalji = useMemo(() => {
    return inspekcijskeKontrole.map(kontrola => ({
      ...kontrola,
      proizvod: proizvodi.find(p => p.id === kontrola.proizvodId)!,
      inspekcijskoTijelo: inspekcijskaTijela.find(t => t.id === kontrola.inspekcijskoTijeloId)!,
    })).filter(k => k.proizvod && k.inspekcijskoTijelo)
      .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());
  }, [inspekcijskeKontrole, proizvodi, inspekcijskaTijela]);

  const handleCreate = () => {
    setSelectedControl(null);
    setMode('create');
    setFormOpen(true);
  };

  const handleEdit = (kontrola: InspekcijskaKontrola) => {
    setSelectedControl(kontrola);
    setMode('edit');
    setFormOpen(true);
  };

  const handleViewDetail = (kontrola: InspekcijskaKontrolaDetalji) => {
    setSelectedDetailControl(kontrola);
    setDetailOpen(true);
  };

  const handleDelete = (kontrola: InspekcijskaKontrola) => {
    setSelectedControl(kontrola);
    setDeleteOpen(true);
  };

  const handleSubmit = (data: Omit<InspekcijskaKontrola, 'id' | 'createdAt'>) => {
    if (mode === 'create') {
      addInspekcijskaKontrola(data);
      toast.success('Inspekcijska kontrola uspješno dodana');
    } else if (selectedControl) {
      updateInspekcijskaKontrola(selectedControl.id, data);
      toast.success('Inspekcijska kontrola uspješno izmijenjena');
    }
  };

  const confirmDelete = () => {
    if (selectedControl) {
      deleteInspekcijskaKontrola(selectedControl.id);
      toast.success('Inspekcijska kontrola uspješno obrisana');
      setDeleteOpen(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Inspekcijske kontrole"
        description="Evidencija izvršenih inspekcijskih kontrola"
        actions={
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Dodaj kontrolu
          </Button>
        }
      />

      <div className="p-6">
        <div className="card-section overflow-hidden">
          {kontroleDetalji.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ClipboardCheck className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-lg mb-2">Nema evidentiranih kontrola</h3>
              <p className="text-muted-foreground mb-4">
                Počnite dodavanjem prve inspekcijske kontrole
              </p>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Dodaj kontrolu
              </Button>
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
                {kontroleDetalji.map((kontrola) => (
                  <tr key={kontrola.id}>
                    <td className="font-medium">
                      {format(new Date(kontrola.datum), 'dd.MM.yyyy')}
                    </td>
                    <td>
                      <div>
                        <p className="font-medium">{kontrola.proizvod.naziv}</p>
                        <p className="text-xs text-muted-foreground">{kontrola.proizvod.proizvodjac}</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium">{kontrola.inspekcijskoTijelo.naziv}</p>
                        <Badge variant="secondary" className="mt-1">
                          {kontrola.inspekcijskoTijelo.inspektorat}
                        </Badge>
                      </div>
                    </td>
                    <td>
                      <Badge className={kontrola.proizvodSiguran ? 'status-safe' : 'status-unsafe'}>
                        {kontrola.proizvodSiguran ? (
                          <><CheckCircle2 className="w-3 h-3 mr-1" /> Siguran</>
                        ) : (
                          <><XCircle className="w-3 h-3 mr-1" /> Nesiguran</>
                        )}
                      </Badge>
                    </td>
                    <td className="max-w-xs truncate text-sm text-muted-foreground">
                      {kontrola.rezultatiKontrole}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetail(kontrola)}
                          title="Pogledaj detalje"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(kontrola)}
                          title="Izmijeni"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(kontrola)}
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
        initialData={selectedControl || undefined}
        mode={mode}
        inspekcijskaTijela={inspekcijskaTijela}
        proizvodi={proizvodi}
      />

      <InspectionDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        kontrola={selectedDetailControl}
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
