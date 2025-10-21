import { Request, Response } from "express";
import {
  izmeniRezervacijuService,
  izmeniStatusRezervacijeService,
  kreirajRezervacijuService,
  obracunajCenu,
  otkaziRezervacijuService,
  prikaziRezervacijuService,
  prikaziSveRezervacijeService,
} from "../services/rezervacija.services";

export const kreirajRezervaciju = async (req: Request, res: Response) => {
  try {
    const rezervacija = await kreirajRezervacijuService(req.body);
    res.status(201).json(rezervacija);
  } catch (error) {
    res.status(500).json({ error: "Greška pri kreiranju rezervacije" });
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

export const prikaziRezervaciju = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const rezervacija = await prikaziRezervacijuService(token);

    if (!rezervacija) {
      return res.status(404).json({ error: "Rezervacija nije pronađena" });
    }

    if (rezervacija.status === "Otkazana") {
      return res
        .status(400)
        .json({ error: "Rezervacija je otkazana i više nije aktivna." });
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

    if (rezervacija.status === "Otkazana") {
      return res
        .status(400)
        .json({ error: "Rezervacija je otkazana i više nije aktivna." });
    }

    res.status(200).json({ poruka: "Status uspešno ažuriran", rezervacija });
  } catch (error) {
    console.error("Greška pri izmeni statusa rezervacije:", error);
    res.status(500).json({ error: "Greška pri izmeni statusa" });
  }
};

export const otkaziRezervaciju = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rezultat = await otkaziRezervacijuService(Number(id));

    if (!rezultat) {
      return res.status(404).json({ error: "Rezervacija nije pronađena" });
    }

    res.status(200).json({ poruka: "Rezervacija uspešno otkazana" });
  } catch (error) {
    console.error("Greška pri otkazivanju rezervacije:", error);
    res.status(500).json({ error: "Greška pri otkazivanju rezervacije" });
  }
};

export const izmeniRezervaciju = async (req: Request, res: Response) => {
  try {
    const { token, dani } = req.body;

    const rezervacija = await prikaziRezervacijuService(token);
    if (!rezervacija) {
      return res.status(404).json({ error: "Rezervacija nije pronađena" });
    }

    const novaCena = await obracunajCenu(dani);
    const izmenjena = await izmeniRezervacijuService(
      rezervacija.id,
      dani,
      novaCena
    );

    res.status(200).json({
      poruka: "Rezervacija uspešno izmenjena",
      rezervacija: izmenjena,
    });
  } catch (error) {
    console.error("Greška pri izmeni rezervacije:", error);
    res.status(500).json({ error: "Greška pri izmeni rezervacije" });
  }
};

export const obracunajCenuController = async (req: Request, res: Response) => {
  try {
    const { dani, promoKod } = req.body;
    const brojDana = dani.length;
    const popustNaDane = brojDana <= 1 ? 0 : brojDana === 2 ? 0.1 : 0.2;
    const earlyBird = new Date() < new Date("2025-05-01") ? 0.1 : 0;

    const finalna = await obracunajCenu(dani, promoKod);
    const ukupna = finalna / (1 - popustNaDane - earlyBird);

    res.status(200).json({
      ukupna: parseFloat(ukupna.toFixed(2)),
      popustNaDane,
      earlyBird,
      finalna,
    });
  } catch (error) {
    console.error("Greška pri obračunu cene:", error);
    res.status(500).json({ error: "Greška pri obračunu cene" });
  }
};
