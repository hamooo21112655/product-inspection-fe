import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useEffect } from "react";

const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Naziv je obavezan")
    .max(50, "Naziv ne smije biti duži od 50 karaktera"),
  manufacturer: z
    .string()
    .trim()
    .min(1, "Proizvođač je obavezan")
    .max(50, "Ime proizvođača ne smije biti duži od 50 karaktera"),
  serialNumber: z
    .string()
    .trim()
    .max(50, "Serijski broj ne smije biti duži 50 karaktera")
    .optional(),
  countryOrigin: z
    .string()
    .trim()
    .min(1, "Zemlja porijekla je obavezna")
    .max(50, "Ime zemlje ne smije biti duže od 50 karaktera"),
  description: z
    .string()
    .trim()
    .max(500, "Opis ne smije biti duži od 255 karaktera")
    .optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Product) => void;
  selectedProduct?: Product;
  mode: "create" | "edit";
}

export function ProductForm({
  open,
  onOpenChange,
  onSubmit,
  selectedProduct,
  mode,
}: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: selectedProduct?.name || "",
      manufacturer: selectedProduct?.manufacturer || "",
      serialNumber: selectedProduct?.serialNumber || "",
      countryOrigin: selectedProduct?.countryOrigin || "",
      description: selectedProduct?.description || "",
    },
  });

  const handleSubmit = (data: Product) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  useEffect(() => {
    if (mode === "edit" && selectedProduct) {
      console.log(selectedProduct);
      form.reset({
        name: selectedProduct.name,
        manufacturer: selectedProduct.manufacturer,
        serialNumber: selectedProduct.serialNumber || "",
        countryOrigin: selectedProduct.countryOrigin,
        description: selectedProduct.description || "",
      });
    }
  }, [mode, selectedProduct, form]);

  useEffect(() => {
    if (mode === "create") {
      form.reset({
        name: "",
        manufacturer: "",
        serialNumber: "",
        countryOrigin: "",
        description: "",
      });
    }
  }, [mode, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>
              {mode === "create" ? "Dodaj novi proizvod" : "Izmijeni proizvod"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              (polja označena sa * su obavezna)
            </DialogDescription>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Naziv proizvoda *</FormLabel>
                  <FormControl>
                    <Input placeholder="Unesite naziv proizvoda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proizvođač *</FormLabel>
                  <FormControl>
                    <Input placeholder="Unesite naziv proizvođača" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serijski broj</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Unesite serijski broj (opcionalno)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="countryOrigin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zemlja porijekla *</FormLabel>
                  <FormControl>
                    <Input placeholder="Unesite zemlju porijekla" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Unesite opis proizvoda (opcionalno)"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Odustani
              </Button>
              <Button type="submit">
                {mode === "create" ? "Dodaj proizvod" : "Sačuvaj izmjene"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
