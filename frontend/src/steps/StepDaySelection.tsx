import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  addDan,
  nextStep,
  prevStep,
  removeDan,
} from "../store/reservationSlice";

export default function StepDaySelection() {
  // Redux
  const dispatch = useDispatch();
  const izabraniDani = useSelector(
    (state: RootState) => state.reservation.dani
  );

  // Local state
  const days = [
    { datum: "2025-05-25", label: "25. maj" },
    { datum: "2025-05-26", label: "26. maj" },
    { datum: "2025-05-27", label: "27. maj" },
  ];
  const [error, setError] = useState("");

  //Checking initially selected days
  const isChecked = (datum: string) =>
    izabraniDani.some((d) => d.datum === datum);

  // Toggling day selection removing and adding to the redux store
  const toggleDan = (datum: string, checked: boolean) => {
    setError("");
    checked
      ? dispatch(addDan({ datum, zonaId: 0 }))
      : dispatch(removeDan(datum));
  };

  const handleNext = () => {
    if (izabraniDani.length === 0) {
      setError("Morate odabrati bar jedan dan trke.");
      return;
    }
    dispatch(nextStep());
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Izaberi dane trke</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map((dan) => (
          <label
            key={dan.datum}
            className="flex items-center gap-3 p-4 border border-black rounded cursor-pointer hover:bg-secondary/70 transition"
          >
            <input
              type="checkbox"
              checked={isChecked(dan.datum)}
              onChange={(e) => toggleDan(dan.datum, e.target.checked)}
              className="accent-primary w-5 h-5"
            />
            <span className="text-black font-medium">{dan.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <div className="text-primary-400 text-sm mt-4 font-semibold">
          {error}
        </div>
      )}
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
