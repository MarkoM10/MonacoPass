import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { resetReservation, setStep } from "../store/reservationSlice";
import { showAlert } from "../store/alertSlice";
import { hideSpinner, showSpinner } from "../store/spinnerSlice";

export default function StepCancelRes() {
  const dispatch = useDispatch();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [rezervacija, setRezervacija] = useState<any>(null);
  const [greska, setGreska] = useState("");
  const [loading, setLoading] = useState(false);
  const [otkazano, setOtkazano] = useState(false);

  const handlePretraga = async () => {
    setLoading(true);
    setGreska("");
    setRezervacija(null);
    try {
      const res = await axios.get(`http://localhost:5000/rezervacija/${token}`);
      if (res.data.kupac?.email !== email) {
        setGreska("Email ne odgovara rezervaciji.");
      } else {
        setRezervacija(res.data);
      }
    } catch {
      setGreska("Nevažeći token.");
    } finally {
      setLoading(false);
    }
  };

  const handlePocetak = () => {
    dispatch(resetReservation());
    dispatch(setStep(0));
  };

  const handleOtkazi = async () => {
    if (!rezervacija?.id) return;
    setLoading(true);
    try {
      dispatch(showSpinner());
      await axios.delete(`http://localhost:5000/rezervacija/${rezervacija.id}`);
      dispatch(hideSpinner());
      setOtkazano(true);
      dispatch(resetReservation());
      dispatch(
        showAlert({ success: true, message: "Rezervacija uspešno otkazana!" })
      );
    } catch {
      setGreska("Greška pri otkazivanju rezervacije.");
    } finally {
      setLoading(false);
    }
  };

  if (otkazano) {
    return (
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold text-red-600">
          Rezervacija je uspešno otkazana.
        </h2>
        <p className="text-gray-700">Token i promo kod su deaktivirani.</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Otkazivanje rezervacije</h3>
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
          placeholder="Email rezervacije"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-black rounded bg-white text-black placeholder-gray-500"
        />
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={handlePocetak}
          className="px-6 py-2 rounded-full border border-neutral text-neutral font-semibold hover:bg-opacity-90 transition-colors"
        >
          Vrati se na početak
        </button>
        <button
          onClick={handlePretraga}
          disabled={loading || !token || !email}
          className="px-6 py-2 rounded-full bg-primary-400 text-white font-semibold hover:bg-opacity-90 transition-colors"
        >
          {loading ? "Provera..." : "Pretraži rezervaciju"}
        </button>
      </div>

      {greska && <div className="text-red-500 font-semibold">{greska}</div>}

      {rezervacija && (
        <div className="border rounded p-4 space-y-4 bg-gray-50">
          <h4 className="font-semibold text-lg">Detalji rezervacije</h4>
          <div>
            Ime: {rezervacija.kupac.ime} {rezervacija.kupac.prezime}
          </div>
          <div>Email: {rezervacija.kupac.email}</div>
          <div>
            Dani:
            <ul className="list-disc list-inside">
              {rezervacija.dan_rezervacije?.map((d: any) => (
                <li key={d.id}>
                  {new Date(d.datum_trke).toLocaleDateString("sr-RS", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  – {d.zona.naziv} ({d.cena} €)
                </li>
              ))}
            </ul>
          </div>
          <div>
            Promo kod:{" "}
            {rezervacija.promo_kod?.length > 0
              ? rezervacija.promo_kod.map((p: any) => p.kod).join(", ")
              : "Nema"}
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleOtkazi}
              className="px-6 py-2 rounded-full bg-primary-400 text-white font-semibold hover:bg-opacity-90 transition-colors"
            >
              Potvrdi otkazivanje
            </button>
            <button
              onClick={() => setRezervacija(null)}
              className="px-6 py-2 rounded-full border border-neutral text-neutral font-semibold hover:bg-opacity-90 transition-colors"
            >
              Odustani
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
