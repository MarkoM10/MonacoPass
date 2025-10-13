import { Request, Response } from "express";
import {
  izmeniStatusRezervacijeService,
  kreirajRezervacijuService,
  obrisiRezervacijuService,
  prikaziRezervacijuService,
  prikaziSveRezervacijeService,
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
    res.status(500).json({ error: "Greška pri dohvatanju rezervacije" });
  }
};
export const izmeniStatusRezervacije = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const rezervacija = await izmeniStatusRezervacijeService(
      Number(id),
      status
    );

    if (!rezervacija) {
      return res.status(404).json({ error: "Rezervacija nije pronađena" });
    }

    res.status(200).json({ poruka: "Status uspešno ažuriran", rezervacija });
  } catch (error) {
    console.error("Greška pri izmeni statusa rezervacije:", error);
    res.status(500).json({ error: "Greška pri izmeni statusa" });
  }
};
export const prikaziSveRezervacije = async (req: Request, res: Response) => {
  try {
    const rezervacije = await prikaziSveRezervacijeService();
    res.status(200).json(rezervacije);
  } catch (error) {
    console.error("Greška pri dohvaćanju rezervacija:", error);
    res.status(500).json({ error: "Greška pri dohvaćanju rezervacija" });
  }
};
export const obrisiRezervaciju = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rezultat = await obrisiRezervacijuService(Number(id));

    if (!rezultat) {
      return res.status(404).json({ error: "Rezervacija nije pronađena" });
    }

    res.status(200).json({ poruka: "Rezervacija uspešno obrisana" });
  } catch (error) {
    console.error("Greška pri brisanju rezervacije:", error);
    res.status(500).json({ error: "Greška pri brisanju rezervacije" });
  }
};
