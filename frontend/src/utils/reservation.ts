import {
  DanPayload,
  KreirajRezervacijuPayload,
  KupacPayload,
} from "../types/types";

export const kreirajPayloadRezervacije = (
  kupac: KupacPayload,
  dani: DanPayload[],
  promoKod?: string
): KreirajRezervacijuPayload => {
  return {
    kupac: {
      ime: kupac.ime,
      prezime: kupac.prezime,
      email: kupac.email,
      adresa1: kupac.adresa1,
      adresa2: kupac.adresa2 || "",
      postanski_broj: kupac.postanski_broj,
      mesto: kupac.mesto,
      drzava: kupac.drzava,
      kompanija: kupac.kompanija || "",
    },
    dani,
    promoKod: promoKod || undefined,
  };
};
