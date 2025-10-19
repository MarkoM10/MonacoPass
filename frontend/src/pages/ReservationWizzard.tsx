import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import StepCustomerInfo from "../steps/StepCustomerInfo";
import StepDaySelection from "../steps/StepDaySelection";
import StepZoneSelection from "../steps/StepZoneSelection";
import StepSummary from "../steps/StepSummary";
import StepAction from "../steps/StepAction";
import StepCancelRes from "../steps/StepCancelRes";
import StepEditRes from "../steps/StepEditRes";
import {
  UserIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";

export default function ReservationWizard() {
  const { action, step } = useSelector((state: RootState) => state.reservation);
  const steps = ["Kupac", "Dani", "Zone", "Pregled"];
  const stepIcons = [
    <UserIcon className="w-4 h-4 inline-block mr-1" />,
    <CalendarDaysIcon className="w-4 h-4 inline-block mr-1" />,
    <MapPinIcon className="w-4 h-4 inline-block mr-1" />,
    <ClipboardDocumentCheckIcon className="w-4 h-4 inline-block mr-1" />,
  ];

  const renderStep = () => {
    if (step === 0) return <StepAction />;
    switch (action) {
      case "kreiranje":
        switch (step) {
          case 1:
            return <StepCustomerInfo />;
          case 2:
            return <StepDaySelection />;
          case 3:
            return <StepZoneSelection />;
          case 4:
            return <StepSummary />;
          default:
            return null;
        }
      case "izmena":
        return <StepEditRes />;
      case "otkazivanje":
        return <StepCancelRes />;
      default:
        return null;
    }
  };

  return (
    <div className="WizzardWrapper flex justify-center items-center min-h-screen">
      <div className="mx-auto p-6 max-w-6xl w-full">
        <div className="bg-white shadow-md rounded-lg p-6">
          {step > 0 && action === "kreiranje" && (
            <div className="flex gap-2 mb-8 justify-center">
              <div className="flex gap-2 mb-8 justify-center">
                {steps.map((label, i) => (
                  <div
                    key={i}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1 ${
                      i + 1 === step
                        ? "bg-primary-400 text-white font-semibold"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {stepIcons[i]}
                    {i + 1 + " " + label}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="stepsWrapper font-body">{renderStep()}</div>
        </div>
      </div>
    </div>
  );
}
