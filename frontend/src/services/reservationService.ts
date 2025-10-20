import {
  CenaInfo,
  CenaRequest,
  KreirajRezervacijuPayload,
  KreirajRezervacijuResponse,
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
