import axios from "axios";
import { DanPayload, KupacPayload } from "../types/types";

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

export const calculateReservationPrice = async (payload: {
  dani: { datum_trke: string; zona_id: number }[];
}) => {
  console.log(payload);
  const response = await axios.post(
    "http://localhost:5000/rezervacija/obracunaj-cenu",
    payload
  );
  return response.data;
};
