import { Request, Response } from "express";
import { prikaziSveZoneService } from "../services/zona.service";

export const prikaziSveZone = async (req: Request, res: Response) => {
  try {
    const zone = await prikaziSveZoneService();
    res.status(200).json(zone);
  } catch (error) {
    console.error("Greška pri dohvaćanju zona:", error);
    res.status(500).json({ error: "Greška pri dohvatanju zona" });
  }
};
