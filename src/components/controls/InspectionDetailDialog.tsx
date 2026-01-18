import { format } from 'date-fns';
import { sr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { InspekcijskaKontrolaDetalji } from '@/types';
import { 
  Package, 
  Building2, 
  Calendar, 
  FileText, 
  Globe, 
  Hash,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface InspectionDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kontrola: InspekcijskaKontrolaDetalji | null;
}

export function InspectionDetailDialog({
  open,
  onOpenChange,
  kontrola,
}: InspectionDetailDialogProps) {
  if (!kontrola) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Detalji inspekcijske kontrole
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {format(new Date(kontrola.datum), "dd. MMMM yyyy. 'u' HH:mm", { locale: sr })}
              </span>
            </div>
            <Badge className={kontrola.proizvodSiguran ? 'status-safe' : 'status-unsafe'}>
              {kontrola.proizvodSiguran ? (
                <><CheckCircle2 className="w-3 h-3 mr-1" /> Siguran</>
              ) : (
                <><XCircle className="w-3 h-3 mr-1" /> Nesiguran</>
              )}
            </Badge>
          </div>

          <Separator />

          {/* Product Details */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Kontrolisani proizvod
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Naziv proizvoda</p>
                  <p className="font-medium">{kontrola.proizvod.naziv}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Proizvođač</p>
                  <p className="font-medium">{kontrola.proizvod.proizvodjac}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Serijski broj</p>
                    <p className="font-medium">{kontrola.proizvod.serijskiBroj || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Zemlja porijekla</p>
                    <p className="font-medium">{kontrola.proizvod.zemljaPorijekla}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inspection Body */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Inspekcijsko tijelo
            </h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="font-medium">{kontrola.inspekcijskoTijelo.naziv}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">{kontrola.inspekcijskoTijelo.inspektorat}</Badge>
                <Badge variant="outline">{kontrola.inspekcijskoTijelo.nadleznost}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Kontakt: {kontrola.inspekcijskoTijelo.kontaktOsoba}
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Rezultati kontrole
            </h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm leading-relaxed">{kontrola.rezultatiKontrole}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
