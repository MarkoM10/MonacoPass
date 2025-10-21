import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { KupacPayload, Dan, ZonaSelection, ActionType } from "../types/types";

export type ReservationState = {
  kupac: KupacPayload;
  dani: {
    datum: string;
    zonaId: number;
  }[];
  promoKod: string;
  token?: string;
  action: ActionType;
  step: number;
  zoneData: ZonaSelection[];
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
  action: "kreiranje",
  step: 0,
};

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    setKupac(state, action: PayloadAction<KupacPayload>) {
      state.kupac = action.payload;
    },
    addDan(state, action: PayloadAction<{ datum: string; zonaId: number }>) {
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
    setZoneData(state, action: PayloadAction<ZonaSelection[]>) {
      state.zoneData = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    resetReservation() {
      return { ...initialState, step: 0 };
    },
    setAkcija(state, action: PayloadAction<ActionType>) {
      state.action = action.payload;
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
