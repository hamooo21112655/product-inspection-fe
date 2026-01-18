export type Inspektorat = 'FBiH' | 'RS' | 'Distrikt Brčko';
export type Nadleznost = 'Tržišna inspekcija' | 'Zdravstveno-sanitarna inspekcija';

export interface Proizvod {
  id: string;
  naziv: string;
  proizvodjac: string;
  serijskiBroj?: string;
  zemljaPorijekla: string;
  opis?: string;
  createdAt: Date;
}

export interface InspekcijskoTijelo {
  id: string;
  naziv: string;
  inspektorat: Inspektorat;
  nadleznost: Nadleznost;
  kontaktOsoba: string;
  createdAt: Date;
}

export interface InspekcijskaKontrola {
  id: string;
  datum: Date;
  inspekcijskoTijeloId: string;
  proizvodId: string;
  rezultatiKontrole: string;
  proizvodSiguran: boolean;
  createdAt: Date;
}

export interface InspekcijskaKontrolaDetalji extends InspekcijskaKontrola {
  inspekcijskoTijelo: InspekcijskoTijelo;
  proizvod: Proizvod;
}
