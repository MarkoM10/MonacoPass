import {
  PencilSquareIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
export default function StepAkcija({
  onOdabir,
}: {
  onOdabir: (akcija: "kreiranje" | "izmena" | "otkazivanje") => void;
}) {
  const kartice = [
    {
      akcija: "kreiranje",
      naziv: "Kreiraj rezervaciju",
      opis: "Započni novu rezervaciju karata za F1 trku.",
      ikona: <PlusCircleIcon className="w-10 h-10 text-primary" />,
      stil: "bg-white hover:bg-primary/10 border border-primary",
    },
    {
      akcija: "izmena",
      naziv: "Izmeni rezervaciju",
      opis: "Unesi token i izmeni postojeću rezervaciju.",
      ikona: <PencilSquareIcon className="w-10 h-10 text-primary" />,
      stil: "bg-white hover:bg-primary/10 border border-primary",
    },
    {
      akcija: "otkazivanje",
      naziv: "Otkaži rezervaciju",
      opis: "Otkaži rezervaciju pomoću tokena.",
      ikona: <XCircleIcon className="w-10 h-10 text-red-500" />,
      stil: "bg-white hover:bg-red-50 border border-red-400",
    },
  ];

  return (
    <div className="space-y-8 text-center">
      <h1 className="text-3xl font-bold text-center font-racing tracking-wide">
        F1 Monaco Pass
      </h1>
      <p className="text-gray-600 text-lg">
        Odaberite akciju koju želite da izvršite
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kartice.map((k) => (
          <button
            key={k.akcija}
            onClick={() => onOdabir(k.akcija as any)}
            className={`rounded-xl p-6 text-left shadow-sm transition-all ${k.stil}`}
          >
            <div className="flex items-center gap-4 mb-4">{k.ikona}</div>
            <h3 className="text-xl font-semibold mb-2">{k.naziv}</h3>
            <p className="text-sm text-gray-700">{k.opis}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
