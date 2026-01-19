import { useContext, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/products/ProductForm";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { Product } from "@/types";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import { ProductContext } from "@/contexts/ProductContext";

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } =
    useContext(ProductContext);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const handleCreate = () => {
    setSelectedProduct(null);
    setMode("create");
    setFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const handleSubmit = (data: Omit<Product, "id" | "createdAt">) => {
    if (mode === "create") {
      addProduct(data);
      toast.success("Proizvod uspješno dodan");
    } else if (selectedProduct) {
      updateProduct(selectedProduct.id, data);
      toast.success("Proizvod uspješno izmijenjen");
    }
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
      toast.success("Proizvod uspješno obrisan");
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
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-lg mb-2">
                Nema evidentiranih proizvoda
              </h3>
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
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="font-medium">{product.name}</td>
                    <td>{product.manufacturer}</td>
                    <td>{product?.serialNumber || "-"}</td>
                    <td>{product.countryOrigin}</td>
                    <td className="max-w-xs truncate">
                      {product?.description || "-"}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product)}
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
        selectedProduct={selectedProduct || undefined}
        mode={mode}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        title="Obriši proizvod"
        description={`Da li ste sigurni da želite obrisati proizvod "${selectedProduct?.name}"? Ova akcija će obrisati sve inspekcijske kontrole koje sadržavaju ovaj proizvod.`}
      />
    </MainLayout>
  );
}
