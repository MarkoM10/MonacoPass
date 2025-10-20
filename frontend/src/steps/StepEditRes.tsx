import { useState, useEffect } from "react";
import {
  pretraziRezervacijuZaIzmenu,
  izracunajCenuIzmene,
  potvrdiIzmenuRezervacije,
} from "../services/reservationService";

import { resetReservation, setStep } from "../store/reservationSlice";
import { useDispatch } from "react-redux";
import { Dan, Zona } from "../types/types";
import { showAlert } from "../store/alertSlice";
import { hideSpinner, showSpinner } from "../store/spinnerSlice";
import { fetchZones } from "../services/zonesService";

export default function StepEditRes() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [rezervacija, setRezervacija] = useState<Dan[]>([]);
  const [zoneData, setZoneData] = useState<Zona[]>([]);
  const dostupniDani = ["2025-05-25", "2025-05-26", "2025-05-27"];
  const [izabraniDani, setIzabraniDani] = useState<Dan[]>([]);
  const [cenaInfo, setCenaInfo] = useState({
    ukupna: 0,
    popustNaDane: 0,
    earlyBird: 0,
    finalna: 0,
  });
  const [loading, setLoading] = useState(false);
  const [poruka, setPoruka] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const loadZones = async () => {
      try {
        const zones = await fetchZones();
        setZoneData(zones);
      } catch (err) {
        console.error("Greška pri učitavanju zona:", err);
      }
    };

    loadZones();
  }, []);

  const handlePocetak = () => {
    dispatch(resetReservation());
    dispatch(setStep(0));
  };

  const handlePretrazi = async () => {
    setLoading(true);
    const data = await pretraziRezervacijuZaIzmenu(token);
    if (!data) {
      setPoruka("Rezervacija nije pronađena.");
      setLoading(false);
      return;
    }
    if (data.kupac.email !== email) {
      setPoruka("Email ne odgovara rezervaciji.");
      setLoading(false);
      return;
    }

    setRezervacija(data.dan_rezervacije);

    const dani = data.dan_rezervacije.map((d) => ({
      datum_trke: new Date(d.datum_trke).toISOString().split("T")[0],
      zona_id: d.zona_id,
      cena: Number(d.cena),
    }));

    setIzabraniDani(dani);
    setPoruka("");

    const cena = await izracunajCenuIzmene(dani);
    if (cena) setCenaInfo(cena);

    setLoading(false);
  };

  const handleToggleDan = async (datum: string, zona_id: number) => {
    const postoji = izabraniDani.find((d) => d.datum_trke === datum);
    const zona = zoneData.find((z) => z.id === zona_id);
    const novaCena = zona ? Number(zona.cena) : 0;

    const novaLista = postoji
      ? izabraniDani.filter((d) => d.datum_trke !== datum)
      : [...izabraniDani, { datum_trke: datum, zona_id, cena: novaCena }];

    console.log(novaLista);

    setIzabraniDani(novaLista);
    await izracunajCenu(novaLista);
  };

  const izracunajCenu = async (dani: Dan[]) => {
    const cena = await izracunajCenuIzmene(dani);
    if (cena) setCenaInfo(cena);
    else setPoruka("Greška pri obračunu cene.");
  };

  const handlePotvrdiIzmenu = async () => {
    try {
      dispatch(showSpinner());
      await potvrdiIzmenuRezervacije(token, email, izabraniDani);
      dispatch(hideSpinner());
      dispatch(
        showAlert({ success: true, message: "Rezervacija uspešno izmenjena!" })
      );
      dispatch(resetReservation());
    } catch {
      setPoruka("Greška pri izmeni rezervacije.");
      dispatch(
        showAlert({ success: false, message: "Greška pri izmeni rezervacije." })
      );
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Izmena rezervacije</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Token rezervacije"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-4 py-2 border border-black rounded bg-white text-black placeholder-gray-500"
          />
          <input
            type="email"
            placeholder="Email kupca"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-black rounded bg-white text-black placeholder-gray-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePocetak}
            className="px-6 py-2 rounded-full border border-neutral text-neutral font-semibold hover:bg-opacity-90 transition-colors"
          >
            Vrati se na početak
          </button>
          <button
            onClick={handlePretrazi}
            className="px-6 py-2 rounded-full bg-primary-400 text-white font-semibold hover:bg-opacity-90 transition-colors pointer"
          >
            Pretraži rezervaciju
          </button>
        </div>
      </div>
      {rezervacija.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold">Izaberi dane i zone</h4>
          {dostupniDani.map((datum) => (
            <div key={datum} className="border p-4 rounded">
              <div className="font-medium">{datum}</div>
              <div className="space-y-1 mt-2">
                {zoneData.map((zona) => {
                  const selected = izabraniDani.find(
                    (d) => d.datum_trke === datum && d.zona_id === zona.id
                  );
                  return (
                    <button
                      key={zona.id}
                      onClick={() => handleToggleDan(datum, zona.id)}
                      className={`block w-full text-left px-4 py-2 rounded border ${
                        selected
                          ? "bg-primary-100 border-primary text-black font-semibold"
                          : "bg-white border-gray-300 hover:bg-gray-100 text-gray-800"
                      }`}
                    >
                      {zona.naziv} — {zona.cena} €
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="space-y-1">
            <div>Ukupna cena bez popusta: {cenaInfo.ukupna.toFixed(2)} €</div>
            <div>
              Popust na broj dana: {(cenaInfo.popustNaDane * 100).toFixed(0)}%
            </div>
            <div>
              Early bird popust: {(cenaInfo.earlyBird * 100).toFixed(0)}%
            </div>
            <div className="font-bold">
              Ukupno za naplatu: {cenaInfo.finalna.toFixed(2)} €
            </div>
          </div>
          <button
            onClick={handlePotvrdiIzmenu}
            className="px-6 py-2 rounded-full bg-primary-400 text-white font-semibold hover:bg-opacity-90 transition-colors"
          >
            Potvrdi izmenu
          </button>
        </div>
      )}
      {poruka && <div className="text-red-500 font-semibold">{poruka}</div>}
    </div>
  );
}
