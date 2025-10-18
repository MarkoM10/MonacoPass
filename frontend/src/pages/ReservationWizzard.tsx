import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  nextStep,
  prevStep,
  setAkcija,
  setStep,
} from "../store/reservationSlice";
import StepAkcija from "../steps/StepAction";
import StepCustomerInfo from "../steps/StepCustomerInfo";
import StepDaySelection from "../steps/StepDaySelection";
import StepZoneSelection from "../steps/StepZoneSelection";
import StepSummary from "../steps/StepSummary";
import StepAction from "../steps/StepAction";
import StepCancelRes from "../steps/StepCancelRes";

const koraciKreiranje = ["Kupac", "Dani", "Zone", "Pregled"];

export default function ReservationWizard() {
  const dispatch = useDispatch();
  const { akcija, step } = useSelector((state: RootState) => state.reservation);

  const next = () => dispatch(nextStep());
  const prev = () => dispatch(prevStep());
  const goToStep = (s: number) => dispatch(setStep(s));

  const handleAkcijaOdabir = (
    odabrana: "kreiranje" | "izmena" | "otkazivanje"
  ) => {
    dispatch(setAkcija(odabrana));
    dispatch(setStep(1));
  };

  const renderStep = () => {
    if (step === 0) return <StepAction onOdabir={handleAkcijaOdabir} />;
    if (akcija === "kreiranje") {
      if (step === 1) return <StepCustomerInfo next={next} />;
      if (step === 2) return <StepDaySelection next={next} prev={prev} />;
      if (step === 3) return <StepZoneSelection next={next} prev={prev} />;
      if (step === 4) return <StepSummary prev={prev} />;
    }
    if (akcija === "izmena") {
      // return <StepEditRes />; // samo jedan korak
    }
    if (akcija === "otkazivanje") {
      return <StepCancelRes />;
    }
    return null;
  };

  return (
    <div className="WizzardWrapper flex justify-center items-center min-h-screen">
      <div className="mx-auto p-6 max-w-6xl w-full">
        <div className="bg-white shadow-md rounded-lg p-6">
          {step > 0 && akcija === "kreiranje" && (
            <div className="flex gap-2 mb-8 justify-center">
              {koraciKreiranje.map((label, i) => (
                <div
                  key={i}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    i + 1 === step
                      ? "bg-primary-400 text-white font-semibold"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {i + 1 + " " + label}
                </div>
              ))}
            </div>
          )}
          <div className="stepsWrapper font-body">{renderStep()}</div>
        </div>
      </div>
    </div>
  );
}
