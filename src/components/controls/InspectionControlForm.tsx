import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { InspekcijskaKontrola, InspekcijskoTijelo, Proizvod } from '@/types';

const inspectionControlSchema = z.object({
  datum: z.date({
    required_error: 'Datum je obavezan',
  }).refine((date) => date <= new Date(), {
    message: 'Datum inspekcijske kontrole ne može biti u budućnosti',
  }),
  inspekcijskoTijeloId: z.string().min(1, 'Inspekcijsko tijelo je obavezno'),
  proizvodId: z.string().min(1, 'Proizvod je obavezan'),
  rezultatiKontrole: z.string().min(1, 'Rezultati kontrole su obavezni').max(1000),
  proizvodSiguran: z.boolean(),
});

type InspectionControlFormData = z.infer<typeof inspectionControlSchema>;

interface InspectionControlFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InspectionControlFormData) => void;
  initialData?: InspekcijskaKontrola;
  mode: 'create' | 'edit';
  inspekcijskaTijela: InspekcijskoTijelo[];
  proizvodi: Proizvod[];
}

export function InspectionControlForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
  inspekcijskaTijela,
  proizvodi,
}: InspectionControlFormProps) {
  const form = useForm<InspectionControlFormData>({
    resolver: zodResolver(inspectionControlSchema),
    defaultValues: {
      datum: initialData?.datum ? new Date(initialData.datum) : undefined,
      inspekcijskoTijeloId: initialData?.inspekcijskoTijeloId || '',
      proizvodId: initialData?.proizvodId || '',
      rezultatiKontrole: initialData?.rezultatiKontrole || '',
      proizvodSiguran: initialData?.proizvodSiguran ?? true,
    },
  });

  const handleSubmit = (data: InspectionControlFormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Dodaj inspekcijsku kontrolu' : 'Izmijeni kontrolu'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="datum"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Datum inspekcijske kontrole *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'dd.MM.yyyy')
                          ) : (
                            <span>Izaberite datum</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Datum ne može biti u budućnosti
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inspekcijskoTijeloId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nadležno inspekcijsko tijelo *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Izaberite inspekcijsko tijelo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {inspekcijskaTijela.map((tijelo) => (
                        <SelectItem key={tijelo.id} value={tijelo.id}>
                          {tijelo.naziv}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="proizvodId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kontrolisani proizvod *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Izaberite proizvod" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {proizvodi.map((proizvod) => (
                        <SelectItem key={proizvod.id} value={proizvod.id}>
                          {proizvod.naziv} - {proizvod.proizvodjac}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rezultatiKontrole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rezultati kontrole *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Unesite rezultate inspekcijske kontrole..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="proizvodSiguran"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Proizvod siguran</FormLabel>
                    <FormDescription>
                      Označite ako proizvod zadovoljava sigurnosne standarde
                    </FormDescription>
                  </div>
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
                {mode === 'create' ? 'Dodaj kontrolu' : 'Sačuvaj izmjene'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
