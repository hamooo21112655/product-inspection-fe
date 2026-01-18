import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDataStore } from '@/store/dataStore';
import { 
  Package, 
  Building2, 
  ClipboardCheck, 
  ShieldCheck,
  ShieldX,
  TrendingUp
} from 'lucide-react';

export default function Dashboard() {
  const { proizvodi, inspekcijskaTijela, inspekcijskeKontrole } = useDataStore();

  const sigurniProizvodi = inspekcijskeKontrole.filter(k => k.proizvodSiguran).length;
  const nesigurniProizvodi = inspekcijskeKontrole.filter(k => !k.proizvodSiguran).length;
  const postoSigurnosti = inspekcijskeKontrole.length > 0 
    ? Math.round((sigurniProizvodi / inspekcijskeKontrole.length) * 100) 
    : 0;

  const stats = [
    {
      title: 'Ukupno proizvoda',
      value: proizvodi.length,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Inspekcijskih tijela',
      value: inspekcijskaTijela.length,
      icon: Building2,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Izvršenih kontrola',
      value: inspekcijskeKontrole.length,
      icon: ClipboardCheck,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Sigurnih proizvoda',
      value: sigurniProizvodi,
      icon: ShieldCheck,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Nesigurnih proizvoda',
      value: nesigurniProizvodi,
      icon: ShieldX,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Stopa sigurnosti',
      value: `${postoSigurnosti}%`,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <MainLayout>
      <PageHeader 
        title="Kontrolna ploča" 
        description="Pregled sistema za kontrolu kvaliteta proizvoda BiH"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="animate-fade-in">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nedavne inspekcijske kontrole</CardTitle>
          </CardHeader>
          <CardContent>
            {inspekcijskeKontrole.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nema evidentiranih kontrola
              </p>
            ) : (
              <div className="space-y-4">
                {inspekcijskeKontrole
                  .slice()
                  .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime())
                  .slice(0, 5)
                  .map((kontrola) => {
                    const proizvod = proizvodi.find(p => p.id === kontrola.proizvodId);
                    const tijelo = inspekcijskaTijela.find(t => t.id === kontrola.inspekcijskoTijeloId);
                    
                    return (
                      <div 
                        key={kontrola.id} 
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${kontrola.proizvodSiguran ? 'bg-success/10' : 'bg-destructive/10'}`}>
                            {kontrola.proizvodSiguran ? (
                              <ShieldCheck className="w-5 h-5 text-success" />
                            ) : (
                              <ShieldX className="w-5 h-5 text-destructive" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{proizvod?.naziv || 'Nepoznat proizvod'}</p>
                            <p className="text-sm text-muted-foreground">{tijelo?.naziv || 'Nepoznato tijelo'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {new Date(kontrola.datum).toLocaleDateString('bs-BA')}
                          </p>
                          <span className={`status-badge ${kontrola.proizvodSiguran ? 'status-safe' : 'status-unsafe'}`}>
                            {kontrola.proizvodSiguran ? 'Siguran' : 'Nesiguran'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
