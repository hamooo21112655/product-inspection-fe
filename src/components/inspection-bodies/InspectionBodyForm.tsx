import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Inspectorate } from "@/enums/inspectorate";
import { Jurisdiction } from "@/enums/jurisdiction";
import { InspectionBody } from "@/types";
import { useEffect } from "react";

const inspectionBodySchema = z.object({
  name: z.string().trim().min(1, "Naziv je obavezan").max(100),
  inspectorate: z.nativeEnum(Inspectorate),
  jurisdiction: z.nativeEnum(Jurisdiction),
  contactPerson: z.string().trim().min(1, "Kontakt osoba je obavezna").max(100),
});

type InspectionBodyFormData = z.infer<typeof inspectionBodySchema>;

interface InspectionBodyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InspectionBodyFormData) => void;
  selectedBody?: InspectionBody;
  mode: "create" | "edit";
}

const inspectorateOptions: Inspectorate[] = [
  Inspectorate.FBIH,
  Inspectorate.RS,
  Inspectorate.DISTRICT_BRCKO,
];
const jurisdictionOptions: Jurisdiction[] = [
  Jurisdiction.HEALTH_SANITARY_INSPECTION,
  Jurisdiction.MARKET_INSPECTION,
];

export function InspectionBodyForm({
  open,
  onOpenChange,
  onSubmit,
  selectedBody,
  mode,
}: InspectionBodyFormProps) {
  const form = useForm<InspectionBodyFormData>({
    resolver: zodResolver(inspectionBodySchema),
    defaultValues: {
      name: selectedBody?.name || "",
      inspectorate: selectedBody?.inspectorate || Inspectorate.FBIH,
      jurisdiction:
        selectedBody?.jurisdiction || Jurisdiction.MARKET_INSPECTION,
      contactPerson: selectedBody?.contactPerson || "",
    },
  });

  const handleSubmit = (data: InspectionBodyFormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  useEffect(() => {
    if (mode === "edit" && selectedBody) {
      form.reset({
        name: selectedBody.name,
        inspectorate: selectedBody.inspectorate,
        jurisdiction: selectedBody.jurisdiction,
        contactPerson: selectedBody.contactPerson,
      });
    }
  }, [mode, selectedBody, form]);

  useEffect(() => {
    if (mode === "create") {
      form.reset({
        name: "",
        inspectorate: Inspectorate.FBIH,
        jurisdiction: Jurisdiction.HEALTH_SANITARY_INSPECTION,
        contactPerson: "",
      });
    }
  }, [mode, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>
              {mode === "create"
                ? "Dodaj inspekcijsko tijelo"
                : "Izmijeni inspekcijsko tijelo"}
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
                  <FormLabel>Naziv inspekcijskog tijela *</FormLabel>
                  <FormControl>
                    <Input placeholder="Unesite naziv" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inspectorate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inspektorat *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Izaberite inspektorat" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {inspectorateOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option === Inspectorate.DISTRICT_BRCKO
                            ? "Distrikt Brčko"
                            : option}
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
              name="jurisdiction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nadležnost *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Izaberite nadležnost" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jurisdictionOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option === Jurisdiction.MARKET_INSPECTION
                            ? "Tržišna inspekcija"
                            : "Zdravstveno-sanitarna inspekcija"}
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
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kontakt osoba *</FormLabel>
                  <FormControl>
                    <Input placeholder="Unesite ime kontakt osobe" {...field} />
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
                {mode === "create" ? "Dodaj" : "Sačuvaj izmjene"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
