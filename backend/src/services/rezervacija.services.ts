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
          datum_trke: new Date(dan.datumTrke),
          cena: dan.cena,
          zona_id: dan.zonaId,
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

export const obrisiRezervacijuService = async (id: number) => {
  const postoji = await prisma.rezervacija.findUnique({ where: { id } });
  if (!postoji) return null;

  await prisma.rezervacija.delete({ where: { id } });
  return true;
};

export const pronadjiRezervacijuPoTokenuEmailu = async (
  token: string,
  email: string
) => {
  return prisma.rezervacija.findFirst({
    where: {
      token,
      kupac: { email },
    },
    include: {
      dan_rezervacije: true,
      kupac: true,
    },
  });
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
    if (promo && promo.iskoriscen_od_kupca_id === null) {
      ukupnaCena *= 0.95;
    }
  }

  const finalnaCena = ukupnaCena * (1 - popust - earlyBird);
  return parseFloat(finalnaCena.toFixed(2));
};

export const proveriDostupnostMesta = async (
  datumTrke: Date,
  zonaId: number
): Promise<boolean> => {
  const zona = await prisma.zona.findUnique({ where: { id: zonaId } });
  if (!zona) return false;

  const brojRezervacija = await prisma.dan_rezervacije.count({
    where: { datum_trke: datumTrke, zona_id: zonaId },
  });

  return brojRezervacija < zona.kapacitet;
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
