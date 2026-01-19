import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Inspection, InspectionBody, Product } from "@/types";
import { useEffect } from "react";

const inspectionControlSchema = z.object({
  inspectionDate: z
    .date({
      required_error: "Datum je obavezan",
    })
    .refine((date) => date <= new Date(), {
      message: "Datum inspekcijske kontrole ne može biti u budućnosti",
    }),
  inspectionBodyId: z.number().min(1, "Inspekcijsko tijelo je obavezno"),
  productId: z.number().min(1, "Proizvod je obavezan"),
  result: z.string().trim().min(1, "Rezultati kontrole su obavezni").max(255),
  productSafe: z.boolean(),
});

type InspectionControlFormData = z.infer<typeof inspectionControlSchema>;

interface InspectionControlFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InspectionControlFormData) => void;
  selectedInspection?: Inspection;
  mode: "create" | "edit";
  inspectionBodies: InspectionBody[];
  products: Product[];
}

export function InspectionControlForm({
  open,
  onOpenChange,
  onSubmit,
  selectedInspection,
  mode,
  inspectionBodies,
  products,
}: InspectionControlFormProps) {
  const form = useForm<InspectionControlFormData>({
    resolver: zodResolver(inspectionControlSchema),
    defaultValues: {
      inspectionDate: selectedInspection?.inspectionDate
        ? new Date(selectedInspection.inspectionDate)
        : undefined,
      inspectionBodyId: selectedInspection?.inspectionBodyId,
      productId: selectedInspection?.productId,
      result: selectedInspection?.result || "",
      productSafe: selectedInspection?.productSafe ?? true,
    },
  });

  const handleSubmit = (data: InspectionControlFormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  useEffect(() => {
    if (mode === "edit" && selectedInspection) {
      console.log(new Date(selectedInspection.inspectionDate));
      form.reset({
        inspectionDate: new Date(selectedInspection.inspectionDate),
        inspectionBodyId: selectedInspection.inspectionBodyId,
        productId: selectedInspection.productId,
        result: selectedInspection.result,
        productSafe: selectedInspection.productSafe,
      });
    }
  }, [mode, selectedInspection, form]);

  useEffect(() => {
    if (mode === "create") {
      form.reset({
        inspectionDate: undefined,
        result: "",
        productSafe: true,
      });
    }
  }, [mode, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>
              {mode === "create"
                ? "Dodaj inspekcijsku kontrolu"
                : "Izmijeni kontrolu"}
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
              name="inspectionDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Datum inspekcijske kontrole *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd.MM.yyyy")
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inspectionBodyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nadležno inspekcijsko tijelo *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Izaberite inspekcijsko tijelo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {inspectionBodies.map((inspectionBody) => (
                        <SelectItem
                          key={inspectionBody.id}
                          value={inspectionBody.id.toString()}
                        >
                          {inspectionBody.name}
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
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kontrolisani proizvod *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Izaberite proizvod" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem
                          key={product.id}
                          value={product.id.toString()}
                        >
                          {product.name} - {product.manufacturer}
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
              name="result"
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
              name="productSafe"
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
                {mode === "create" ? "Dodaj kontrolu" : "Sačuvaj izmjene"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
