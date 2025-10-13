import { Request, Response } from "express";
import {
  iskoristiPromoKodService,
  prikaziPromoKodService,
} from "../services/promo.service";

export const prikaziPromoKod = async (req: Request, res: Response) => {
  try {
    const { kod } = req.params;
    const promo = await prikaziPromoKodService(kod);

    if (!promo) {
      return res.status(404).json({ error: "Promo kod nije pronađen" });
    }

    res.status(200).json(promo);
  } catch (error) {
    console.error("Greška pri dohvaćanju promo koda:", error);
    res.status(500).json({ error: "Greška pri dohvatanju promo koda" });
  }
};
export const iskoristiPromoKod = async (req: Request, res: Response) => {
  try {
    const { kod } = req.params;
    const { kupacId } = req.body;

    const promo = await iskoristiPromoKodService(kod, kupacId);

    if (!promo) {
      return res
        .status(404)
        .json({ error: "Promo kod nije pronađen ili već iskorišćen" });
    }

    res.status(200).json({ poruka: "Promo kod uspešno iskorišćen", promo });
  } catch (error) {
    console.error("Greška pri iskorišćavanju promo koda:", error);
    res.status(500).json({ error: "Greška pri obradi promo koda" });
  }
};
