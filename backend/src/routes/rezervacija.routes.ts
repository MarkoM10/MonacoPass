import express from "express";
import {
  izmeniRezervaciju,
  izmeniStatusRezervacije,
  kreirajRezervaciju,
  otkaziRezervaciju,
  prikaziRezervaciju,
  prikaziSveRezervacije,
  obracunajCenuController,
} from "../controllers/rezervacija.controller";

const router = express.Router();

router.post("/", kreirajRezervaciju);
router.get("/", prikaziSveRezervacije);
router.get("/:token", prikaziRezervaciju);
router.patch("/:id/status", izmeniStatusRezervacije);
router.put("/izmeni", izmeniRezervaciju);
router.put("/:id", otkaziRezervaciju);
router.post("/obracunaj-cenu", obracunajCenuController);

export default router;
