import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { ProductForm } from '@/components/products/ProductForm';
import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog';
import { useDataStore } from '@/store/dataStore';
import { Proizvod } from '@/types';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function Products() {
  const { proizvodi, addProizvod, updateProizvod, deleteProizvod } = useDataStore();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Proizvod | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  const handleCreate = () => {
    setSelectedProduct(null);
    setMode('create');
    setFormOpen(true);
  };

  const handleEdit = (product: Proizvod) => {
    setSelectedProduct(product);
    setMode('edit');
    setFormOpen(true);
  };

  const handleDelete = (product: Proizvod) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const handleSubmit = (data: Omit<Proizvod, 'id' | 'createdAt'>) => {
    if (mode === 'create') {
      addProizvod(data);
      toast.success('Proizvod uspješno dodan');
    } else if (selectedProduct) {
      updateProizvod(selectedProduct.id, data);
      toast.success('Proizvod uspješno izmijenjen');
    }
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProizvod(selectedProduct.id);
      toast.success('Proizvod uspješno obrisan');
      setDeleteOpen(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Proizvodi"
        description="Evidencija registrovanih proizvoda na tržištu BiH"
        actions={
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Dodaj proizvod
          </Button>
        }
      />

      <div className="p-6">
        <div className="card-section overflow-hidden">
          {proizvodi.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-lg mb-2">Nema evidentiranih proizvoda</h3>
              <p className="text-muted-foreground mb-4">
                Počnite dodavanjem prvog proizvoda
              </p>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Dodaj proizvod
              </Button>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Naziv</th>
                  <th>Proizvođač</th>
                  <th>Serijski broj</th>
                  <th>Zemlja porijekla</th>
                  <th>Opis</th>
                  <th className="w-24">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {proizvodi.map((proizvod) => (
                  <tr key={proizvod.id}>
                    <td className="font-medium">{proizvod.naziv}</td>
                    <td>{proizvod.proizvodjac}</td>
                    <td>{proizvod.serijskiBroj || '-'}</td>
                    <td>{proizvod.zemljaPorijekla}</td>
                    <td className="max-w-xs truncate">{proizvod.opis || '-'}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(proizvod)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(proizvod)}
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

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedProduct || undefined}
        mode={mode}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        title="Obriši proizvod"
        description={`Da li ste sigurni da želite obrisati proizvod "${selectedProduct?.naziv}"? Ova akcija se ne može poništiti.`}
      />
    </MainLayout>
  );
}
