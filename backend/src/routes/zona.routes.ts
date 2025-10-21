import express from "express";
import { prikaziSveZone } from "../controllers/zona.controller";

const router = express.Router();
router.get("/", prikaziSveZone);

export default router;
