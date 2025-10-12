import express from "express";
import {
  kreirajRezervaciju,
  prikaziRezervaciju,
} from "../controllers/rezervacija.controller";

const router = express.Router();

router.post("/", kreirajRezervaciju);
router.get("/:token", prikaziRezervaciju);

export default router;
