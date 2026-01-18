import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { InspectionDetailDialog } from '@/components/controls/InspectionDetailDialog';
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
import { useDataStore } from '@/store/dataStore';
import { InspekcijskaKontrolaDetalji } from '@/types';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { sr } from 'date-fns/locale';
import { CalendarIcon, FileBarChart, Filter, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Reports() {
  const { inspekcijskeKontrole, proizvodi, inspekcijskaTijela } = useDataStore();
  
  const [selectedTijeloId, setSelectedTijeloId] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [showReport, setShowReport] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDetailControl, setSelectedDetailControl] = useState<InspekcijskaKontrolaDetalji | null>(null);

  const filteredControls = useMemo(() => {
    if (!showReport) return [];

    return inspekcijskeKontrole
      .filter(kontrola => {
        // Filter by inspection body
        if (selectedTijeloId !== 'all' && kontrola.inspekcijskoTijeloId !== selectedTijeloId) {
          return false;
        }

        // Filter by date range
        const kontrolaDate = new Date(kontrola.datum);
        if (dateFrom && dateTo) {
          return isWithinInterval(kontrolaDate, {
            start: startOfDay(dateFrom),
            end: endOfDay(dateTo),
          });
        }
        if (dateFrom) {
          return kontrolaDate >= startOfDay(dateFrom);
        }
        if (dateTo) {
          return kontrolaDate <= endOfDay(dateTo);
        }

        return true;
      })
      .map(kontrola => ({
        ...kontrola,
        proizvod: proizvodi.find(p => p.id === kontrola.proizvodId)!,
        inspekcijskoTijelo: inspekcijskaTijela.find(t => t.id === kontrola.inspekcijskoTijeloId)!,
      }))
      .filter(k => k.proizvod && k.inspekcijskoTijelo)
      .sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime());
  }, [inspekcijskeKontrole, proizvodi, inspekcijskaTijela, selectedTijeloId, dateFrom, dateTo, showReport]);

  const handleGenerateReport = () => {
    setShowReport(true);
  };

  const handleViewDetail = (kontrola: InspekcijskaKontrolaDetalji) => {
    setSelectedDetailControl(kontrola);
    setDetailOpen(true);
  };

  const selectedTijelo = inspekcijskaTijela.find(t => t.id === selectedTijeloId);

  const safeCount = filteredControls.filter(k => k.proizvodSiguran).length;
  const unsafeCount = filteredControls.filter(k => !k.proizvodSiguran).length;

  return (
    <MainLayout>
      <PageHeader
        title="Izvještaji"
        description="Generisanje izvještaja o inspekcijskim kontrolama"
      />

      <div className="p-6 space-y-6">
        {/* Parameter Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Parametri izvještaja
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Inspection Body Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Inspekcijsko tijelo</label>
                <Select value={selectedTijeloId} onValueChange={setSelectedTijeloId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Izaberite inspekcijsko tijelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Sva inspekcijska tijela</SelectItem>
                    {inspekcijskaTijela.map((tijelo) => (
                      <SelectItem key={tijelo.id} value={tijelo.id}>
                        {tijelo.naziv}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date From */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Datum od</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dateFrom && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, 'dd.MM.yyyy') : 'Izaberite datum'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Datum do</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dateTo && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, 'dd.MM.yyyy') : 'Izaberite datum'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Generate Button */}
              <div className="flex items-end">
                <Button onClick={handleGenerateReport} className="w-full">
                  <FileBarChart className="w-4 h-4 mr-2" />
                  Generiši izvještaj
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Results */}
        {showReport && (
          <Card className="animate-fade-in">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Izvještaj o inspekcijskim kontrolama</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedTijeloId === 'all' 
                      ? 'Sva inspekcijska tijela' 
                      : selectedTijelo?.naziv}
                    {dateFrom && dateTo && (
                      <> • {format(dateFrom, 'dd.MM.yyyy')} - {format(dateTo, 'dd.MM.yyyy')}</>
                    )}
                    {dateFrom && !dateTo && (
                      <> • Od {format(dateFrom, 'dd.MM.yyyy')}</>
                    )}
                    {!dateFrom && dateTo && (
                      <> • Do {format(dateTo, 'dd.MM.yyyy')}</>
                    )}
                  </p>
                </div>
                <div className="flex gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-success">{safeCount}</p>
                    <p className="text-xs text-muted-foreground">Sigurnih</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-destructive">{unsafeCount}</p>
                    <p className="text-xs text-muted-foreground">Nesigurnih</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{filteredControls.length}</p>
                    <p className="text-xs text-muted-foreground">Ukupno</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredControls.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FileBarChart className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="font-medium text-lg mb-2">Nema rezultata</h3>
                  <p className="text-muted-foreground">
                    Za odabrane parametre nema evidentiranih kontrola
                  </p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>R.br.</th>
                      <th>Datum kontrole</th>
                      <th>Proizvod</th>
                      <th>Serijski broj</th>
                      <th>Zemlja porijekla</th>
                      <th>Status</th>
                      <th className="w-16">Detalji</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredControls.map((kontrola, index) => (
                      <tr key={kontrola.id}>
                        <td className="text-muted-foreground">{index + 1}</td>
                        <td className="font-medium">
                          {format(new Date(kontrola.datum), "dd. MMMM yyyy.", { locale: sr })}
                        </td>
                        <td>
                          <div>
                            <p className="font-medium">{kontrola.proizvod.naziv}</p>
                            <p className="text-xs text-muted-foreground">{kontrola.proizvod.proizvodjac}</p>
                          </div>
                        </td>
                        <td>{kontrola.proizvod.serijskiBroj || '-'}</td>
                        <td>{kontrola.proizvod.zemljaPorijekla}</td>
                        <td>
                          <Badge className={kontrola.proizvodSiguran ? 'status-safe' : 'status-unsafe'}>
                            {kontrola.proizvodSiguran ? (
                              <><CheckCircle2 className="w-3 h-3 mr-1" /> Siguran</>
                            ) : (
                              <><XCircle className="w-3 h-3 mr-1" /> Nesiguran</>
                            )}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetail(kontrola)}
                            title="Pogledaj detalje"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <InspectionDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        kontrola={selectedDetailControl}
      />
    </MainLayout>
  );
}
