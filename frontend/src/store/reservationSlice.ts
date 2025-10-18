import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Kupac = {
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

type Dan = {
  datum: string;
  zonaId: number;
};

type Zona = {
  id: number;
  naziv: string;
  kapacitet: number;
  cena: number;
  pogodna_za_invalide: boolean;
  ima_ekran: boolean;
};

type ReservationState = {
  kupac: Kupac;
  dani: Dan[];
  promoKod: string;
  token?: string;
  akcija: "kreiranje" | "izmena" | "otkazivanje";
  step: number;
  zoneData: Zona[];
};

const initialState: ReservationState = {
  kupac: {
    ime: "",
    prezime: "",
    email: "",
    adresa1: "",
    postanski_broj: "",
    mesto: "",
    drzava: "",
  },
  dani: [],
  zoneData: [],
  promoKod: "",
  token: undefined,
  akcija: "kreiranje",
  step: 0,
};

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    setKupac(state, action: PayloadAction<Kupac>) {
      state.kupac = action.payload;
    },
    addDan(state, action: PayloadAction<Dan>) {
      const postoji = state.dani.find((d) => d.datum === action.payload.datum);
      if (!postoji) state.dani.push(action.payload);
      else postoji.zonaId = action.payload.zonaId;
    },
    removeDan(state, action: PayloadAction<string>) {
      state.dani = state.dani.filter((d) => d.datum !== action.payload);
    },
    setPromoKod(state, action: PayloadAction<string>) {
      state.promoKod = action.payload;
    },
    setZoneData(state, action: PayloadAction<Zona[]>) {
      state.zoneData = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    resetReservation() {
      return { ...initialState, step: 0 };
    },
    setAkcija(
      state,
      action: PayloadAction<"kreiranje" | "izmena" | "otkazivanje">
    ) {
      state.akcija = action.payload;
    },
    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
    },
    nextStep(state) {
      state.step += 1;
    },
    prevStep(state) {
      state.step = Math.max(state.step - 1, 0);
    },
  },
});

export const {
  setKupac,
  addDan,
  removeDan,
  setPromoKod,
  resetReservation,
  setToken,
  setAkcija,
  setStep,
  nextStep,
  prevStep,
  setZoneData,
} = reservationSlice.actions;

export default reservationSlice.reducer;
