import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { resetReservation, setStep } from "../store/reservationSlice";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

export default function ReservationResult() {
  const dispatch = useDispatch();
  const { kupac, token, promoKod } = useSelector(
    (state: RootState) => state.reservation
  );

  const handlePocetak = () => {
    dispatch(resetReservation());
    dispatch(setStep(0));
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-20 bg-primary rounded-full flex items-center justify-center">
          <CheckBadgeIcon className="w-10 h-10 text-primary-300" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-primary">
        Rezervacija uspešno kreirana!
      </h2>
      <p className="text-black">
        Hvala,{" "}
        <span className="font-semibold">
          {kupac.ime} {kupac.prezime}
        </span>
        .<br />
        Vaš token za izmenu/otkazivanje je:
      </p>
      <div className="text-xl font-mono text-primary">{token}</div>
      <div className="mt-4 p-4 border rounded bg-primary-50 text-primary-800">
        <h4 className="font-semibold text-lg mb-2">Tvoj promo-kod</h4>
        <div className="text-xl font-bold tracking-wide">{promoKod}</div>
        <p className="text-sm mt-2">
          Podeli ovaj kod sa prijateljem on dobija 5% popusta, a ti poklon ispod
          sedišta!
        </p>
      </div>

      <button
        onClick={handlePocetak}
        className="mt-6 px-6 py-2 rounded bg-primary-400 text-white font-semibold hover:bg-opacity-90 transition"
      >
        Vrati se na početak
      </button>
    </div>
  );
}
