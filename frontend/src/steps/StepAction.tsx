import {
  PencilSquareIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
export default function StepAkcija({
  onOdabir,
}: {
  onOdabir: (action: "kreiranje" | "izmena" | "otkazivanje") => void;
}) {
  const kartice = [
    {
      action: "kreiranje",
      heading: "Kreiraj rezervaciju",
      des: "Započni novu rezervaciju karata za F1 trku.",
      icon: <PlusCircleIcon className="w-10 h-10 text-primary" />,
      style: "bg-white hover:bg-primary/10 border border-primary",
    },
    {
      action: "izmena",
      heading: "Izmeni rezervaciju",
      des: "Unesi token i izmeni postojeću rezervaciju.",
      icon: <PencilSquareIcon className="w-10 h-10 text-primary" />,
      style: "bg-white hover:bg-primary/10 border border-primary",
    },
    {
      action: "otkazivanje",
      heading: "Otkaži rezervaciju",
      des: "Otkaži rezervaciju pomoću tokena.",
      icon: <XCircleIcon className="w-10 h-10 text-red-500" />,
      style: "bg-white hover:bg-red-50 border border-red-400",
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
            key={k.action}
            onClick={() => onOdabir(k.action as any)}
            className={`rounded-xl p-6 text-left shadow-sm transition-all ${k.style}`}
          >
            <div className="flex items-center gap-4 mb-4">{k.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{k.heading}</h3>
            <p className="text-sm text-gray-700">{k.des}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
