export type Dan = {
  datum_trke: string;
  zona_id: number;
  cena: number;
};

export type Zona = {
  id: number;
  naziv: string;
  kapacitet: number;
  cena: number;
};

export type KupacPayload = {
  ime: string;
  prezime: string;
  email: string;
  adresa1: string;
  adresa2?: string;
  postanski_broj: string;
  mesto: string;
  drzava: string;
  kompanija?: string;
};

export type DanPayload = {
  datumTrke: string;
  cena: number;
  zonaId: number;
};

export type ZonaSelection = {
  id: number;
  naziv: string;
  kapacitet: number;
  cena: string;
  pogodna_za_invalide: boolean;
  ima_ekran: boolean;
};

export type CenaInfo = {
  ukupna: number;
  popustNaDane: number;
  earlyBird: number;
  finalna: number;
};

export type ActionType = "kreiranje" | "izmena" | "otkazivanje";
