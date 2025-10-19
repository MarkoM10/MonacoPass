import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  nextStep,
  resetReservation,
  setKupac,
  setStep,
} from "../store/reservationSlice";
import { RootState } from "../store/store";
import { validateKupac } from "../utils/formValidations";

export default function StepCustomerInfo() {
  //Redux
  const dispatch = useDispatch();
  const { kupac } = useSelector((state: RootState) => state.reservation);

  //States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState(kupac);

  //Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    const validationErrors = validateKupac(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    dispatch(setKupac(form));
    dispatch(nextStep());
  };

  const handleStart = () => {
    dispatch(resetReservation());
    dispatch(setStep(0));
  };

  return (
    <div className="space-y-6">
      <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <input
            name="ime"
            placeholder="Ime*"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-black rounded bg-white text-black placeholder-gray-500"
            value={form.ime}
          />
          {errors.ime && (
            <div className="text-primary-400 font-semibold text-sm mt-4">
              {errors.ime}
            </div>
          )}
        </div>
        <div>
          <input
            name="prezime"
            placeholder="Prezime*"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-black rounded bg-white text-black placeholder-gray-500"
            value={form.prezime}
          />
          {errors.prezime && (
            <div className="text-primary-400 font-semibold text-sm mt-4">
              {errors.prezime}
            </div>
          )}
        </div>
        <div>
          <input
            name="email"
            placeholder="Email*"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-black rounded bg-white text-black placeholder-gray-500"
            value={form.email}
          />
          {errors.email && (
            <div className="text-primary-400 font-semibold text-sm mt-4">
              {errors.email}
            </div>
          )}
        </div>
        <div>
          <input
            name="potvrda_emaila"
            placeholder="Potvrda emaila*"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-black rounded bg-white text-black placeholder-gray-500"
            value={form.potvrda_emaila}
          />
          {errors.potvrda_emaila && (
            <div className="text-primary-400 font-semibold text-sm mt-4">
              {errors.potvrda_emaila}
            </div>
          )}
        </div>
        <div>
          <input
            name="adresa1"
            placeholder="Adresa 1*"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-black rounded bg-white text-black placeholder-gray-500"
            value={form.adresa1}
          />
          {errors.adresa1 && (
            <div className="text-primary-400 font-semibold text-sm mt-4">
              {errors.adresa1}
            </div>
          )}
        </div>
        <div>
          <input
            name="adresa2"
            placeholder="Adresa 2"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-black rounded bg-white text-black placeholder-gray-500"
            value={form.adresa2}
          />
        </div>
        <div>
          <input
            name="postanski_broj"
            placeholder="Poštanski broj*"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-black rounded bg-white text-black placeholder-gray-500"
            value={form.postanski_broj}
          />
          {errors.postanski_broj && (
            <div className="text-primary-400 font-semibold text-sm mt-4">
              {errors.postanski_broj}
            </div>
          )}
        </div>
        <div>
          <input
            name="mesto"
            placeholder="Mesto*"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-black rounded bg-white text-black placeholder-gray-500"
            value={form.mesto}
          />
          {errors.mesto && (
            <div className="text-primary-400 font-semibold text-sm mt-4">
              {errors.mesto}
            </div>
          )}
        </div>
        <div>
          <input
            name="drzava"
            placeholder="Država*"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-black rounded bg-white text-black placeholder-gray-500"
            value={form.drzava}
          />
          {errors.drzava && (
            <div className="text-primary-400 font-semibold text-sm mt-4">
              {errors.drzava}
            </div>
          )}
        </div>
        <div>
          <input
            name="kompanija"
            placeholder="Kompanija"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-black rounded bg-white text-black placeholder-gray-500"
            value={form.kompanija}
          />
        </div>
      </form>
      <div className="flex justify-between mt-8">
        <button
          onClick={handleStart}
          className="px-6 py-2 rounded-full border border-neutral text-neutral font-semibold hover:bg-opacity-90 transition-colors"
        >
          Vrati se na početak
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 rounded-full bg-primary-400 text-white font-semibold hover:bg-opacity-90 transition-colors"
        >
          Dalje
        </button>
      </div>
    </div>
  );
}
