import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { kreirajRezervaciju } from "../services/reservationService";
import { setToken } from "../store/reservationSlice";
import { useEffect, useState } from "react";
import ReservationResult from "../components/ReservationResult";

type CenaInfo = {
  ukupna: number;
  popustNaDane: number;
  earlyBird: number;
  finalna: number;
};

export default function StepSummary({ prev }: { prev: () => void }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [poruka, setPoruka] = useState("");
  const [success, setSuccess] = useState(false);
  const [calculating, setCalculating] = useState(true);
  const [cenaInfo, setCenaInfo] = useState<CenaInfo>({
    ukupna: 0,
    popustNaDane: 0,
    earlyBird: 0,
    finalna: 0,
  });

  const { dani, zoneData, kupac, promoKod } = useSelector(
    (state: RootState) => state.reservation
  );

  useEffect(() => {
    const brojDana = dani.length;
    const popustNaDane = brojDana <= 1 ? 0 : brojDana === 2 ? 0.1 : 0.2;
    const earlyBird = new Date() < new Date("2025-05-01") ? 0.1 : 0;

    const ukupna = dani.reduce((sum, dan) => {
      const zona = zoneData.find((z) => z.id === dan.zonaId);
      return zona ? sum + Number(zona.cena) : sum;
    }, 0);

    const finalna = ukupna * (1 - popustNaDane - earlyBird);

    setCenaInfo({
      ukupna: parseFloat(ukupna.toFixed(2)),
      popustNaDane,
      earlyBird,
      finalna: parseFloat(finalna.toFixed(2)),
    });

    setCalculating(false);
  }, [dani, zoneData]);

  const daniZaSlanje = dani.map((d) => {
    const zona = zoneData.find((z) => z.id === d.zonaId);
    return {
      datumTrke: d.datum,
      cena: zona ? zona.cena : 0,
      zonaId: d.zonaId,
    };
  });

  const payload = {
    kupac: {
      ime: kupac.ime,
      prezime: kupac.prezime,
      email: kupac.email,
      kompanija: kupac.kompanija || "",
      adresa1: kupac.adresa1,
      adresa2: kupac.adresa2 || "",
      postanski_broj: kupac.postanski_broj,
      mesto: kupac.mesto,
      drzava: kupac.drzava,
    },
    dani: daniZaSlanje,
    promoKod: promoKod || undefined,
  };

  const handlePotvrdi = async () => {
    setLoading(true);
    try {
      const data = await kreirajRezervaciju(payload);
      dispatch(setToken(data.token));
      setSuccess(true);
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
          <div>Promo kod: {promoKod || "Nema"}</div>

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
          <div className="flex justify-between mt-6">
            <button
              onClick={prev}
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
