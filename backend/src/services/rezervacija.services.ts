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
