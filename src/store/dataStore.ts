import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Proizvod, InspekcijskoTijelo, InspekcijskaKontrola } from '@/types';

interface DataStore {
  proizvodi: Proizvod[];
  inspekcijskaTijela: InspekcijskoTijelo[];
  inspekcijskeKontrole: InspekcijskaKontrola[];
  
  // Proizvodi
  addProizvod: (proizvod: Omit<Proizvod, 'id' | 'createdAt'>) => void;
  updateProizvod: (id: string, proizvod: Partial<Proizvod>) => void;
  deleteProizvod: (id: string) => void;
  
  // Inspekcijska tijela
  addInspekcijskoTijelo: (tijelo: Omit<InspekcijskoTijelo, 'id' | 'createdAt'>) => void;
  updateInspekcijskoTijelo: (id: string, tijelo: Partial<InspekcijskoTijelo>) => void;
  deleteInspekcijskoTijelo: (id: string) => void;
  
  // Inspekcijske kontrole
  addInspekcijskaKontrola: (kontrola: Omit<InspekcijskaKontrola, 'id' | 'createdAt'>) => void;
  updateInspekcijskaKontrola: (id: string, kontrola: Partial<InspekcijskaKontrola>) => void;
  deleteInspekcijskaKontrola: (id: string) => void;
}

const generateId = () => crypto.randomUUID();

export const useDataStore = create<DataStore>()(
  persist(
    (set) => ({
      proizvodi: [
        {
          id: '1',
          naziv: 'Mlijeko 1L',
          proizvodjac: 'Meggle BiH',
          serijskiBroj: 'MLK-2024-001',
          zemljaPorijekla: 'Bosna i Hercegovina',
          opis: 'Pasterizirano mlijeko 2.8% m.m.',
          createdAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          naziv: 'Pšenično brašno T-500',
          proizvodjac: 'Mlin Banja Luka',
          zemljaPorijekla: 'Bosna i Hercegovina',
          createdAt: new Date('2024-01-20'),
        },
        {
          id: '3',
          naziv: 'Električni grijač 2000W',
          proizvodjac: 'TechnoElectric',
          serijskiBroj: 'EG-2024-789',
          zemljaPorijekla: 'Kina',
          opis: 'Električni grijač za grijanje prostorija',
          createdAt: new Date('2024-02-01'),
        },
      ],
      inspekcijskaTijela: [
        {
          id: '1',
          naziv: 'Federalna tržišna inspekcija Sarajevo',
          inspektorat: 'FBiH',
          nadleznost: 'Tržišna inspekcija',
          kontaktOsoba: 'Amir Hodžić',
          createdAt: new Date('2024-01-01'),
        },
        {
          id: '2',
          naziv: 'Republička sanitarna inspekcija Banja Luka',
          inspektorat: 'RS',
          nadleznost: 'Zdravstveno-sanitarna inspekcija',
          kontaktOsoba: 'Marko Petrović',
          createdAt: new Date('2024-01-01'),
        },
        {
          id: '3',
          naziv: 'Inspekcija Distrikta Brčko',
          inspektorat: 'Distrikt Brčko',
          nadleznost: 'Tržišna inspekcija',
          kontaktOsoba: 'Ivana Kovačević',
          createdAt: new Date('2024-01-01'),
        },
      ],
      inspekcijskeKontrole: [
        {
          id: '1',
          datum: new Date('2024-06-15'),
          inspekcijskoTijeloId: '1',
          proizvodId: '1',
          rezultatiKontrole: 'Proizvod ispunjava sve sanitarne i kvalitativne standarde. Deklaracija je uredna.',
          proizvodSiguran: true,
          createdAt: new Date('2024-06-15'),
        },
        {
          id: '2',
          datum: new Date('2024-07-20'),
          inspekcijskoTijeloId: '2',
          proizvodId: '3',
          rezultatiKontrole: 'Utvrđeni nedostaci u električnoj izolaciji. Proizvod ne zadovoljava sigurnosne standarde.',
          proizvodSiguran: false,
          createdAt: new Date('2024-07-20'),
        },
      ],

      // Proizvodi CRUD
      addProizvod: (proizvod) =>
        set((state) => ({
          proizvodi: [
            ...state.proizvodi,
            { ...proizvod, id: generateId(), createdAt: new Date() },
          ],
        })),
      updateProizvod: (id, proizvod) =>
        set((state) => ({
          proizvodi: state.proizvodi.map((p) =>
            p.id === id ? { ...p, ...proizvod } : p
          ),
        })),
      deleteProizvod: (id) =>
        set((state) => ({
          proizvodi: state.proizvodi.filter((p) => p.id !== id),
        })),

      // Inspekcijska tijela CRUD
      addInspekcijskoTijelo: (tijelo) =>
        set((state) => ({
          inspekcijskaTijela: [
            ...state.inspekcijskaTijela,
            { ...tijelo, id: generateId(), createdAt: new Date() },
          ],
        })),
      updateInspekcijskoTijelo: (id, tijelo) =>
        set((state) => ({
          inspekcijskaTijela: state.inspekcijskaTijela.map((t) =>
            t.id === id ? { ...t, ...tijelo } : t
          ),
        })),
      deleteInspekcijskoTijelo: (id) =>
        set((state) => ({
          inspekcijskaTijela: state.inspekcijskaTijela.filter((t) => t.id !== id),
        })),

      // Inspekcijske kontrole CRUD
      addInspekcijskaKontrola: (kontrola) =>
        set((state) => ({
          inspekcijskeKontrole: [
            ...state.inspekcijskeKontrole,
            { ...kontrola, id: generateId(), createdAt: new Date() },
          ],
        })),
      updateInspekcijskaKontrola: (id, kontrola) =>
        set((state) => ({
          inspekcijskeKontrole: state.inspekcijskeKontrole.map((k) =>
            k.id === id ? { ...k, ...kontrola } : k
          ),
        })),
      deleteInspekcijskaKontrola: (id) =>
        set((state) => ({
          inspekcijskeKontrole: state.inspekcijskeKontrole.filter((k) => k.id !== id),
        })),
    }),
    {
      name: 'inspection-data-store',
      partialize: (state) => ({
        proizvodi: state.proizvodi,
        inspekcijskaTijela: state.inspekcijskaTijela,
        inspekcijskeKontrole: state.inspekcijskeKontrole,
      }),
    }
  )
);
