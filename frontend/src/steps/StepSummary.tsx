import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  kreirajRezervaciju,
  calculateReservationPrice,
} from "../services/reservationService";
import {
  proveriPromoKod,
  oznaciPromoKodKaoIskoriscen,
} from "../services/promoService";
import { prevStep, setPromoKod, setToken } from "../store/reservationSlice";
import { useEffect, useState } from "react";
import ReservationResult from "../components/ReservationResult";
import { CenaInfo, DanPayload } from "../types/types";
import { showAlert } from "../store/alertSlice";
import { hideSpinner, showSpinner } from "../store/spinnerSlice";
import { kreirajPayloadRezervacije } from "../utils/reservation";

export default function StepSummary() {
  //Redux
  const dispatch = useDispatch();
  const { dani, zoneData, kupac } = useSelector(
    (state: RootState) => state.reservation
  );

  //Local state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [poruka, setPoruka] = useState("");
  const [calculating, setCalculating] = useState(false);
  const [promoKodInput, setPromoKodInput] = useState("");
  const [promoPoruka, setPromoPoruka] = useState("");
  const [promoValidan, setPromoValidan] = useState(false);
  const [cenaInfo, setCenaInfo] = useState<CenaInfo>({
    ukupna: 0,
    popustNaDane: 0,
    earlyBird: 0,
    finalna: 0,
  });

  const daniZaSlanje: DanPayload[] = dani.map((d) => {
    const zona = zoneData.find((z) => z.id === d.zonaId);
    return {
      datumTrke: d.datum,
      zonaId: d.zonaId,
      cena: zona ? Number(zona.cena) : 0,
    };
  });

  const fetchPrice = async (promoKod?: string) => {
    setCalculating(true);
    try {
      const daniZaObracun = dani.map((d) => ({
        datum_trke: d.datum,
        zona_id: d.zonaId,
      }));
      const data = await calculateReservationPrice({
        dani: daniZaObracun,
        promoKod,
      });
      setCenaInfo(data);
    } catch (err) {
      console.error("Greška pri obračunu cene:", err);
      setPoruka("Greška pri obračunu cene.");
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    fetchPrice();
  }, [dani]);

  const handleProveraPromoKoda = async () => {
    setPromoPoruka("");
    setPromoValidan(false);
    const kod = promoKodInput.trim();
    if (!kod) {
      setPromoPoruka("Unesite promo-kod.");
      return;
    }

    const data = await proveriPromoKod(kod);
    if (!data || !data.kod) {
      setPromoPoruka("Promo-kod nije pronađen.");
    } else if (data.status === "Iskorišćen" || data.iskoriscen_od_kupca_id) {
      setPromoPoruka("Promo-kod je već iskorišćen.");
    } else {
      setPromoPoruka("Promo-kod je uspešno primenjen! 🎉");
      setPromoValidan(true);
      fetchPrice(kod);
    }
  };

  const handlePotvrdi = async () => {
    setLoading(true);
    try {
      dispatch(showSpinner());
      const payload = kreirajPayloadRezervacije(
        kupac,
        daniZaSlanje,
        promoValidan ? promoKodInput.trim() : undefined
      );
      const data = await kreirajRezervaciju(payload);
      const { kod } = data.promo_kod?.[0] || {};
      if (kod) dispatch(setPromoKod(kod));
      dispatch(setToken(data.token));
      if (promoValidan) {
        await oznaciPromoKodKaoIskoriscen(promoKodInput.trim(), data.kupac.id);
      }
      dispatch(hideSpinner());
      setSuccess(true);
      dispatch(
        showAlert({ success: true, message: "Rezervacija uspešno kreirana!" })
      );
    } catch (err) {
      setPoruka("Greška pri slanju rezervacije.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {success ? (
        <ReservationResult />
      ) : (
        <div>
          <h3 className="text-xl font-bold">Pregled rezervacije</h3>
          <div>
            Ime: {kupac.ime} {kupac.prezime}
          </div>
          <div>Email: {kupac.email}</div>
          <div>Dani: {dani.map((d) => d.datum).join(", ")}</div>
          {calculating ? (
            <div className="text-gray-500">Računam cenu...</div>
          ) : (
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
          )}

          {poruka && <div className="text-primary font-semibold">{poruka}</div>}

          <div className="space-y-2 mt-4">
            <label
              htmlFor="promo"
              className="font-medium text-sm text-gray-700"
            >
              Imaš promo-kod od prijatelja?
            </label>
            <input
              type="text"
              id="promo"
              value={promoKodInput}
              onChange={(e) => setPromoKodInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              placeholder="Unesi promo-kod"
            />
            <button
              onClick={handleProveraPromoKoda}
              className="px-4 py-2 bg-primary-400 text-white rounded hover:bg-opacity-90"
            >
              Primeni kod
            </button>
            {promoPoruka && (
              <div className="text-sm text-red-500 mt-2">{promoPoruka}</div>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => dispatch(prevStep())}
              className="px-6 py-2 rounded-full border border-neutral text-neutral font-semibold hover:bg-opacity-90 transition-colors"
            >
              Nazad
            </button>
            <button
              onClick={handlePotvrdi}
              disabled={loading}
              className={`px-6 py-2 rounded-full bg-primary-400 text-white font-semibold transition-colors ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-opacity-90"
              }`}
            >
              {loading ? "Slanje..." : "Potvrdi rezervaciju"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
