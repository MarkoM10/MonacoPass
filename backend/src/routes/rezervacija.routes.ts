import express from "express";
import {
  izmeniRezervaciju,
  izmeniStatusRezervacije,
  kreirajRezervaciju,
  obrisiRezervaciju,
  prikaziRezervaciju,
  prikaziSveRezervacije,
  obracunajCenuHandler,
} from "../controllers/rezervacija.controller";

const router = express.Router();

router.post("/", kreirajRezervaciju);
router.get("/", prikaziSveRezervacije);
router.get("/:token", prikaziRezervaciju);
router.patch("/:id/status", izmeniStatusRezervacije);
router.delete("/:id", obrisiRezervaciju);
router.put("/izmeni", izmeniRezervaciju);
router.post("/obracunaj-cenu", obracunajCenuHandler);

export default router;
