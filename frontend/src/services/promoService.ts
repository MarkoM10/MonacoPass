import axios from "axios";
import { PromoKodInfo } from "../types/types";

export const proveriPromoKod = async (
  kod: string
): Promise<PromoKodInfo | null> => {
  try {
    const response = await axios.get(`http://localhost:5000/promo/${kod}`);
    return response.data;
  } catch {
    return null;
  }
};

export const oznaciPromoKodKaoIskoriscen = async (
  kod: string,
  kupacId: number
): Promise<void> => {
  await axios.patch(`http://localhost:5000/promo/${kod}/iskoristi`, {
    kupacId,
  });
};
