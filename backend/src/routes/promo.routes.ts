import express from "express";
import {
  iskoristiPromoKod,
  prikaziPromoKod,
} from "../controllers/promo.controller";

const router = express.Router();

router.get("/:kod", prikaziPromoKod);
router.patch("/:kod/iskoristi", iskoristiPromoKod);

export default router;
