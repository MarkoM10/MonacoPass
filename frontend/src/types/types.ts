// Rezervacija i dani
export type Dan = {
  datum_trke: string;
  zona_id: number;
  cena: number;
};

// Kupac
export type KupacPayload = {
  ime: string;
  prezime: string;
  email: string;
  potvrda_emaila?: string;
  adresa1: string;
  adresa2?: string;
  postanski_broj: string;
  mesto: string;
  drzava: string;
  kompanija?: string;
};

// Zone
export type Zona = {
  id: number;
  naziv: string;
  kapacitet: number;
  cena: number;
};

export type ZonaSelection = {
  id: number;
  naziv: string;
  kapacitet: number;
  cena: string;
  pogodna_za_invalide: boolean;
  ima_ekran: boolean;
};

// Cena
export type CenaInfo = {
  ukupna: number;
  popustNaDane: number;
  earlyBird: number;
  finalna: number;
  promoPopust?: number;
};

export type CenaRequest = {
  dani: {
    datum_trke: string;
    zona_id: number;
  }[];
  promoKod?: string;
};

// Promo kod
export type PromoKodInfo = {
  kod: string;
  status: string;
  iskoriscen_od_kupca_id?: number;
};

// Rezervacija
export type KreirajRezervacijuPayload = {
  kupac: KupacPayload;
  dani: Dan[];
  promoKod?: string;
};

export type KreirajRezervacijuResponse = {
  token: string;
  kupac: { id: number };
  promo_kod?: { kod: string }[];
};
export type ActionType = "kreiranje" | "izmena" | "otkazivanje";

export type RezervacijaDetalji = {
  id: number;
  kupac: {
    ime: string;
    prezime: string;
    email: string;
  };
  dan_rezervacije: {
    id: number;
    datum_trke: string;
    cena: number;
    zona: {
      naziv: string;
    };
  }[];
};

export type RezervacijaZaIzmenu = {
  id: number;
  kupac: {
    ime: string;
    prezime: string;
    email: string;
  };
  dan_rezervacije: {
    id: number;
    datum_trke: string;
    cena: number;
    zona_id: number;
    zona: {
      naziv: string;
    };
  }[];
};
