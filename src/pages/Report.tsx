import { useState, useContext } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Inspection, Product, InspectionBody } from "@/types";
import {
  Filter,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Eye,
  Package,
  Globe,
  Hash,
  FileText,
  Building2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ProductContext } from "@/contexts/ProductContext";
import { InspectionBodyContext } from "@/contexts/InspectionBodyContext";
import { ReportContext } from "@/contexts/ReportContext";

export default function Report() {
  const { products } = useContext(ProductContext);
  const { inspectionBodies } = useContext(InspectionBodyContext);
  const { report, filters, setFilters } = useContext(ReportContext);

  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] =
    useState<Inspection | null>(null);

  const handleInspectionBodyChange = (value: string) => {
    const inspectionBodyId = value === "0" ? 0 : parseInt(value);
    setFilters({
      ...filters,
      inspectionBodyId,
      page: 1,
    });
  };

  const handleFromDateChange = (date: Date | undefined) => {
    if (date) {
      setFilters({
        ...filters,
        from: format(date, "yyyy-MM-dd"),
        page: 1,
      });
    } else {
      setFilters({
        ...filters,
        from: "",
        page: 1,
      });
    }
    setFromDateOpen(false);
  };

  const handleToDateChange = (date: Date | undefined) => {
    if (date) {
      setFilters({
        ...filters,
        to: format(date, "yyyy-MM-dd"),
        page: 1,
      });
    } else {
      setFilters({
        ...filters,
        to: "",
        page: 1,
      });
    }
    setToDateOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setFilters({
      ...filters,
      page: newPage,
    });
  };

  const handlePageSizeChange = (value: string) => {
    setFilters({
      ...filters,
      limit: parseInt(value),
      page: 1,
    });
  };

  const clearFilters = () => {
    setFilters({
      inspectionBodyId: 0,
      page: 1,
      limit: 10,
      from: "",
      to: "",
    });
  };

  const handleShowDetails = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setDetailsOpen(true);
  };

  const fromDateValue = filters.from ? new Date(filters.from) : undefined;
  const toDateValue = filters.to ? new Date(filters.to) : undefined;

  const totalPages = report?.totalPages || 1;
  const inspections = report?.data || [];
  const totalItems = report?.total || 0;

  const getProductDetails = (inspection: Inspection): Product | undefined => {
    return products.find((p) => p.id === inspection.productId);
  };

  const getInspectionBodyDetails = (
    inspection: Inspection,
  ): InspectionBody | undefined => {
    return inspectionBodies.find((ib) => ib.id === inspection.inspectionBodyId);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Izveštaj o kontrolama"
        description="Pregled inspekcijskih kontrola sa mogućnošću filtriranja po datumu i inspekcijskom tijelu"
      />

      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filteri
            </CardTitle>
            <CardDescription>
              Filtrirajte inspekcijske kontrole po datumu i inspekcijskom tijelu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label className="block text-sm font-medium mb-2">
                  Inspekcijsko tijelo
                </label>
                <Select
                  value={filters.inspectionBodyId?.toString() || "0"}
                  onValueChange={handleInspectionBodyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Izaberite inspekcijsko tijelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {inspectionBodies.map((body) => (
                      <SelectItem key={body.id} value={body.id.toString()}>
                        {body.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium mb-2">
                  Od datuma
                </label>
                <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !fromDateValue && "text-muted-foreground",
                      )}
                    >
                      {fromDateValue ? (
                        format(fromDateValue, "dd.MM.yyyy")
                      ) : (
                        <span>Izaberite datum</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDateValue}
                      onSelect={handleFromDateChange}
                      disabled={(date) =>
                        date > new Date() || (toDateValue && date > toDateValue)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium mb-2">
                  Do datuma
                </label>
                <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !toDateValue && "text-muted-foreground",
                      )}
                    >
                      {toDateValue ? (
                        format(toDateValue, "dd.MM.yyyy")
                      ) : (
                        <span>Izaberite datum</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDateValue}
                      onSelect={handleToDateChange}
                      disabled={(date) =>
                        date > new Date() ||
                        (fromDateValue && date < fromDateValue)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Obriši filtere
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Rezultati kontrola</CardTitle>
                <CardDescription>
                  {report ? (
                    <>
                      Prikazano {inspections.length} od {totalItems} kontrola
                      {filters.from ||
                      filters.to ||
                      filters.inspectionBodyId !== 0
                        ? " (filtrirano)"
                        : ""}
                    </>
                  ) : (
                    "Učitavanje podataka..."
                  )}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Prikaži po stranici:
                </span>
                <Select
                  value={filters.limit.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!report ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : inspections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Filter className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-medium text-lg mb-2">
                  Nema pronađenih kontrola
                </h3>
                <p className="text-muted-foreground mb-4">
                  {filters.from || filters.to || filters.inspectionBodyId !== 0
                    ? "Pokušajte sa drugim filterima"
                    : "Nema evidentiranih kontrola"}
                </p>
                {(filters.from ||
                  filters.to ||
                  filters.inspectionBodyId !== 0) && (
                  <Button onClick={clearFilters}>Obriši filtere</Button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-hidden border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Datum
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Proizvod
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Proizvođač
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium w-24">
                          Detalji
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {inspections.map((inspection) => {
                        const product = products.find(
                          (p) => p.id === inspection.productId,
                        );

                        return (
                          <tr key={inspection.id} className="hover:bg-muted/50">
                            <td className="px-4 py-3">
                              {format(
                                new Date(inspection.inspectionDate),
                                "dd.MM.yyyy",
                              )}
                            </td>
                            <td className="px-4 py-3 font-medium">
                              {product?.name || "Nepoznato"}
                            </td>
                            <td className="px-4 py-3">
                              {product?.manufacturer || "Nepoznato"}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                className={
                                  inspection.productSafe
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-red-100 text-red-800 hover:bg-red-100"
                                }
                              >
                                {inspection.productSafe ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 mr-1" />{" "}
                                    Siguran
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3 h-3 mr-1" />{" "}
                                    Nesiguran
                                  </>
                                )}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleShowDetails(inspection)}
                                className="h-8 px-2"
                                title="Prikaži detalje"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Stranica {filters.page} od {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(filters.page - 1)}
                        disabled={filters.page <= 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (filters.page <= 3) {
                            pageNum = i + 1;
                          } else if (filters.page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = filters.page - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                filters.page === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        },
                      )}

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(filters.page + 1)}
                        disabled={filters.page >= totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Ukupno: {totalItems} kontrola
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Detalji inspekcijske kontrole</DialogTitle>
            <DialogDescription>
              Pregled detalja kontrolisanog proizvoda i rezultata kontrole
            </DialogDescription>
          </DialogHeader>

          {selectedInspection && (
            <div className="space-y-6">
              {/* Product Details */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Detalji kontrolisanog proizvoda
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(() => {
                    const product = getProductDetails(selectedInspection);
                    const inspectionBody =
                      getInspectionBodyDetails(selectedInspection);

                    return (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Naziv:</span>
                          </div>
                          <p className="text-sm pl-6">
                            {product?.name || "Nepoznato"}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              Serijski broj:
                            </span>
                          </div>
                          <p className="text-sm pl-6">
                            {product?.serialNumber || "Nije unijeto"}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              Zemlja porijekla:
                            </span>
                          </div>
                          <p className="text-sm pl-6">
                            {product?.countryOrigin || "Nepoznato"}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              Proizvođač:
                            </span>
                          </div>
                          <p className="text-sm pl-6">
                            {product?.manufacturer || "Nepoznato"}
                          </p>
                        </div>

                        {inspectionBody && (
                          <div className="space-y-2 md:col-span-2">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                Inspekcijsko tijelo:
                              </span>
                            </div>
                            <p className="text-sm pl-6">
                              {inspectionBody.name}
                            </p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Rezultati kontrole
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Status proizvoda:
                      </span>
                      <Badge
                        className={
                          selectedInspection.productSafe
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {selectedInspection.productSafe ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Siguran
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" /> Nesiguran
                          </>
                        )}
                      </Badge>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Datum:{" "}
                      {format(
                        new Date(selectedInspection.inspectionDate),
                        "dd.MM.yyyy",
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Rezultati inspekcije:
                      </span>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedInspection.result}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
