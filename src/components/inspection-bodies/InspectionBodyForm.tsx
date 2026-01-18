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
import { InspekcijskoTijelo, Inspektorat, Nadleznost } from "@/types";

const inspectionBodySchema = z.object({
  naziv: z.string().min(1, "Naziv je obavezan").max(200),
  inspektorat: z.enum(["FBiH", "RS", "Distrikt Brčko"] as const),
  nadleznost: z.enum([
    "Tržišna inspekcija",
    "Zdravstveno-sanitarna inspekcija",
  ] as const),
  kontaktOsoba: z.string().min(1, "Kontakt osoba je obavezna").max(100),
});

type InspectionBodyFormData = z.infer<typeof inspectionBodySchema>;

interface InspectionBodyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InspectionBodyFormData) => void;
  initialData?: InspekcijskoTijelo;
  mode: "create" | "edit";
}

const inspektoratOptions: Inspektorat[] = ["FBiH", "RS", "Distrikt Brčko"];
const nadleznostOptions: Nadleznost[] = [
  "Tržišna inspekcija",
  "Zdravstveno-sanitarna inspekcija",
];

export function InspectionBodyForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: InspectionBodyFormProps) {
  const form = useForm<InspectionBodyFormData>({
    resolver: zodResolver(inspectionBodySchema),
    defaultValues: {
      naziv: initialData?.naziv || "",
      inspektorat: initialData?.inspektorat || "FBiH",
      nadleznost: initialData?.nadleznost || "Tržišna inspekcija",
      kontaktOsoba: initialData?.kontaktOsoba || "",
    },
  });

  const handleSubmit = (data: InspectionBodyFormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Dodaj inspekcijsko tijelo"
              : "Izmijeni inspekcijsko tijelo"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="naziv"
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
              name="inspektorat"
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
                      {inspektoratOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
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
              name="nadleznost"
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
                      {nadleznostOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
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
              name="kontaktOsoba"
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
