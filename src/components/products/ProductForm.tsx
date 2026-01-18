import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Proizvod } from '@/types';

const productSchema = z.object({
  naziv: z.string().min(1, 'Naziv je obavezan').max(100),
  proizvodjac: z.string().min(1, 'Proizvođač je obavezan').max(100),
  serijskiBroj: z.string().max(50).optional(),
  zemljaPorijekla: z.string().min(1, 'Zemlja porijekla je obavezna').max(100),
  opis: z.string().max(500).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProductFormData) => void;
  initialData?: Proizvod;
  mode: 'create' | 'edit';
}

export function ProductForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      naziv: initialData?.naziv || '',
      proizvodjac: initialData?.proizvodjac || '',
      serijskiBroj: initialData?.serijskiBroj || '',
      zemljaPorijekla: initialData?.zemljaPorijekla || '',
      opis: initialData?.opis || '',
    },
  });

  const handleSubmit = (data: ProductFormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Dodaj novi proizvod' : 'Izmijeni proizvod'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="naziv"
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
              name="proizvodjac"
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
              name="serijskiBroj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serijski broj</FormLabel>
                  <FormControl>
                    <Input placeholder="Unesite serijski broj (opcionalno)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zemljaPorijekla"
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
              name="opis"
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
                {mode === 'create' ? 'Dodaj proizvod' : 'Sačuvaj izmjene'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
