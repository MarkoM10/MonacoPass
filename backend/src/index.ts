import express from "express";
import cors from "cors";
import rezervacijaRoutes from "./routes/rezervacija.routes";
import zonaRoutes from "./routes/zona.routes";
import promoRoutes from "./routes/promo.routes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rute
app.use("/rezervacija", rezervacijaRoutes);
app.use("/zone", zonaRoutes);
app.use("/promo", promoRoutes);

// Pokretanje servera
app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});
