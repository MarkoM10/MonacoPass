import { Request, Response } from "express";
import {
  kreirajRezervacijuService,
  prikaziRezervacijuService,
} from "../services/rezervacija.services";

export const kreirajRezervaciju = async (req: Request, res: Response) => {
  try {
    const rezervacija = await kreirajRezervacijuService(req.body);
    res.status(201).json(rezervacija);
  } catch (error) {
    console.error("Greška u kreiranju rezervacije:", error);
    res.status(500).json({ error: "Greška pri kreiranju rezervacije" });
  }
};

export const prikaziRezervaciju = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const rezervacija = await prikaziRezervacijuService(token);

    if (!rezervacija) {
      return res.status(404).json({ error: "Rezervacija nije pronađena" });
    }

    res.status(200).json(rezervacija);
  } catch (error) {
    console.error("Greška u prikazu rezervacije:", error);
    res.status(500).json({ error: "Greška pri dohvaćanju rezervacije" });
  }
};
