import {
  CenaInfo,
  CenaRequest,
  KreirajRezervacijuPayload,
  KreirajRezervacijuResponse,
  RezervacijaDetalji,
  Dan,
} from "../types/types";
import axios from "axios";

export const calculateReservationPrice = async (
  payload: CenaRequest
): Promise<CenaInfo> => {
  const response = await axios.post(
    "http://localhost:5000/rezervacija/obracunaj-cenu",
    payload
  );
  return response.data;
};

export const kreirajRezervaciju = async (
  payload: KreirajRezervacijuPayload
): Promise<KreirajRezervacijuResponse> => {
  const response = await axios.post(
    "http://localhost:5000/rezervacija",
    payload
  );
  return response.data;
};

export const pretraziRezervaciju = async (
  token: string
): Promise<RezervacijaDetalji | null> => {
  try {
    const res = await axios.get(`http://localhost:5000/rezervacija/${token}`);
    return res.data;
  } catch {
    return null;
  }
};

export const otkaziRezervaciju = async (id: number): Promise<void> => {
  await axios.delete(`http://localhost:5000/rezervacija/${id}`);
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

export const pretraziRezervacijuZaIzmenu = async (
  token: string
): Promise<RezervacijaZaIzmenu | null> => {
  try {
    const res = await axios.get(`http://localhost:5000/rezervacija/${token}`);
    return res.data;
  } catch {
    return null;
  }
};

export const izracunajCenuIzmene = async (
  dani: Dan[]
): Promise<CenaInfo | null> => {
  try {
    const payload = dani.map((d) => ({
      datum_trke: d.datum_trke,
      zona_id: d.zona_id,
    }));

    const res = await axios.post(
      "http://localhost:5000/rezervacija/obracunaj-cenu",
      { dani: payload }
    );

    return res.data;
  } catch {
    return null;
  }
};

export const potvrdiIzmenuRezervacije = async (
  token: string,
  email: string,
  dani: Dan[]
): Promise<void> => {
  const payload = {
    token,
    email,
    dani: dani.map((d) => ({
      datum_trke: d.datum_trke,
      zona_id: d.zona_id,
    })),
  };

  await axios.put("http://localhost:5000/rezervacija/izmeni", payload);
};
