import axios from "axios";

type KupacPayload = {
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

type DanPayload = {
  datumTrke: string;
  cena: number;
  zonaId: number;
};

export const kreirajRezervaciju = async (payload: {
  kupac: KupacPayload;
  dani: DanPayload[];
  promoKod?: string;
}) => {
  const response = await axios.post(
    "http://localhost:5000/rezervacija",
    payload
  );
  return response.data;
};
