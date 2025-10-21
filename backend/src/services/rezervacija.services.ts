import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { randomBytes } from "crypto";

export const kreirajRezervacijuService = async (data: any) => {
  const token = randomBytes(16).toString("hex");

  const kupac = await prisma.kupac.create({
    data: data.kupac,
  });

  const rezervacija = await prisma.rezervacija.create({
    data: {
      token,
      status: "Kreirana",
      kupac_id: kupac.id,
      promo_kod: {
        create: {
          kod: randomBytes(6).toString("hex"),
          status: "Aktivan",
        },
      },
      dan_rezervacije: {
        create: data.dani.map((dan: any) => ({
          datum_trke: new Date(dan.datum_trke),
          cena: dan.cena,
          zona_id: dan.zona_id,
        })),
      },
    },
    include: {
      promo_kod: true,
      dan_rezervacije: {
        include: {
          zona: true,
        },
      },
      kupac: true,
    },
  });

  return rezervacija;
};

export const prikaziRezervacijuService = async (token: string) => {
  return await prisma.rezervacija.findUnique({
    where: { token },
    include: {
      kupac: true,
      promo_kod: true,
      dan_rezervacije: {
        include: {
          zona: true,
        },
      },
    },
  });
};

export const izmeniStatusRezervacijeService = async (
  id: number,
  status: string
) => {
  const rezervacija = await prisma.rezervacija.findUnique({ where: { id } });

  if (!rezervacija) return null;

  return await prisma.rezervacija.update({
    where: { id },
    data: { status },
  });
};
export const prikaziSveRezervacijeService = async () => {
  return await prisma.rezervacija.findMany({
    orderBy: { datum_kreiranja: "desc" },
    include: {
      kupac: true,
      promo_kod: true,
      dan_rezervacije: {
        include: {
          zona: true,
        },
      },
    },
  });
};

export const otkaziRezervacijuService = async (id: number) => {
  const rezervacija = await prisma.rezervacija.findUnique({ where: { id } });
  if (!rezervacija) return null;

  await prisma.rezervacija.update({
    where: { id },
    data: { status: "Otkazana" },
  });

  const promoKod = await prisma.promo_kod.findFirst({
    where: { rezervacija_id: id },
  });

  if (promoKod) {
    await prisma.promo_kod.update({
      where: { kod: promoKod.kod },
      data: { status: "Nevažeći" },
    });
  }

  return true;
};

export const obracunajCenu = async (
  dani: { datum_trke: Date; zona_id: number }[],
  promoKod?: string
): Promise<number> => {
  const brojDana = dani.length;
  const popust = brojDana <= 1 ? 0 : brojDana === 2 ? 0.1 : 0.2;
  const earlyBird = new Date() < new Date("2025-05-01") ? 0.1 : 0;

  let ukupnaCena = 0;

  for (const dan of dani) {
    const zona = await prisma.zona.findUnique({ where: { id: dan.zona_id } });
    if (zona) ukupnaCena += Number(zona.cena);
  }

  if (promoKod) {
    const promo = await prisma.promo_kod.findUnique({
      where: { kod: promoKod },
    });
    if (
      promo &&
      promo.status === "Aktivan" &&
      promo.iskoriscen_od_kupca_id === null
    ) {
      ukupnaCena *= 0.95;
    }
  }

  const finalnaCena = ukupnaCena * (1 - popust - earlyBird);
  return parseFloat(finalnaCena.toFixed(2));
};

export const izmeniRezervacijuService = async (
  rezervacijaId: number,
  dani: { datum_trke: Date; zona_id: number }[],
  novaCena: number
) => {
  await prisma.dan_rezervacije.deleteMany({
    where: { rezervacija_id: rezervacijaId },
  });

  for (const dan of dani) {
    const zona = await prisma.zona.findUnique({ where: { id: dan.zona_id } });

    await prisma.dan_rezervacije.create({
      data: {
        rezervacija_id: rezervacijaId,
        datum_trke: new Date(dan.datum_trke),
        zona_id: dan.zona_id,
        cena: zona?.cena ?? new Prisma.Decimal(0),
      },
    });
  }

  return prisma.rezervacija.update({
    where: { id: rezervacijaId },
    data: { status: "Izmenjena" },
    include: { dan_rezervacije: true },
  });
};
