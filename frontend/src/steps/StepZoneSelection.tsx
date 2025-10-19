import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  addDan,
  nextStep,
  prevStep,
  setZoneData,
} from "../store/reservationSlice";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { UserIcon, TvIcon } from "@heroicons/react/24/solid";
import { ZonaSelection } from "../types/types";
import { fetchZones } from "../services/zonesService";

export default function StepZoneSelection() {
  //Redux
  const dispatch = useDispatch();
  const dani = useSelector((state: RootState) => state.reservation.dani);

  //Local state
  const [zone, setZone] = useState<ZonaSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDatum, setOpenDatum] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  //Hooks and Handlers
  useEffect(() => {
    const loadZones = async () => {
      try {
        const data = await fetchZones();
        setZone(data);
        dispatch(setZoneData(data));
      } catch (err) {
        console.error("Greška pri učitavanju zona:", err);
      } finally {
        setLoading(false);
      }
    };
    loadZones();
  }, []);

  const handleZonaToggle = (datum: string, zonaId: number) => {
    const trenutnaZona = dani.find((d) => d.datum === datum)?.zonaId;
    const novaZonaId = trenutnaZona === zonaId ? 0 : zonaId;
    dispatch(addDan({ datum, zonaId: novaZonaId }));
  };

  const isSelected = (datum: string, zonaId: number) =>
    dani.find((d) => d.datum === datum)?.zonaId === zonaId;

  const toggleAccordion = (datum: string) => {
    setOpenDatum((prev) => (prev === datum ? null : datum));
  };

  const handleNext = () => {
    const nevalidniDani = dani
      .filter((d) => d.zonaId === 0)
      .map((d) => d.datum);
    if (nevalidniDani.length > 0) {
      setErrors(nevalidniDani);
      setOpenDatum(nevalidniDani[0]);
      return;
    }
    setErrors([]);
    dispatch(nextStep());
  };

  if (loading) return <div>Učitavanje zona...</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Izaberi zonu za svaki dan</h3>
      {dani.map((dan) => {
        const datumLabel = new Date(dan.datum).toLocaleDateString("sr-RS", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

        const isOpen = openDatum === dan.datum;

        return (
          <div key={dan.datum} className="border rounded-lg">
            <button
              onClick={() => toggleAccordion(dan.datum)}
              className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 transition"
            >
              <span className="font-semibold text-black">{datumLabel}</span>
              <ChevronDownIcon
                className={`w-5 h-5 text-black transform transition-transform ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            {isOpen && (
              <div className="p-4 space-y-2 bg-white">
                {zone.map((zona) => {
                  const selected = isSelected(dan.datum, zona.id);
                  return (
                    <button
                      key={zona.id}
                      onClick={() => handleZonaToggle(dan.datum, zona.id)}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded border transition-colors text-sm ${
                        selected
                          ? "bg-secondary border-primary text-black font-semibold"
                          : "bg-white border-gray-300 hover:bg-gray-100 text-gray-800"
                      }`}
                    >
                      <span className="flex-1">{zona.naziv}</span>
                      <span className="w-24 text-right">{zona.cena} €</span>
                      <span className="w-10 text-right">
                        {zona.pogodna_za_invalide && (
                          <UserIcon className="w-5 h-5 text-primary inline-block" />
                        )}
                      </span>
                      <span className="w-10 text-right">
                        {zona.ima_ekran && (
                          <TvIcon className="w-5 h-5 text-primary inline-block" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            {errors.includes(dan.datum) && (
              <div className="text-primary-400 font-semibold text-sm mt-4 px-4 py-3">
                Morate odabrati zonu za ovaj dan.
              </div>
            )}
          </div>
        );
      })}

      <div className="flex justify-between mt-8">
        <button
          onClick={() => dispatch(prevStep())}
          className="px-6 py-2 rounded-full border border-neutral text-neutral font-semibold hover:bg-opacity-90 transition-colors"
        >
          Nazad
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 rounded-full bg-primary-400 text-white font-semibold hover:bg-opacity-90 transition-colors"
        >
          Dalje
        </button>
      </div>
    </div>
  );
}
