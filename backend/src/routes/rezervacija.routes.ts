import express from "express";
import {
  izmeniStatusRezervacije,
  kreirajRezervaciju,
  obrisiRezervaciju,
  prikaziRezervaciju,
  prikaziSveRezervacije,
} from "../controllers/rezervacija.controller";

const router = express.Router();

router.post("/", kreirajRezervaciju);
router.get("/", prikaziSveRezervacije);
router.get("/:token", prikaziRezervaciju);
router.patch("/:id/status", izmeniStatusRezervacije);
router.delete("/:id", obrisiRezervaciju);

export default router;
