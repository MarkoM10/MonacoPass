import { prisma } from "../db";

export const prikaziPromoKodService = async (kod: string) => {
  return await prisma.promo_kod.findUnique({
    where: { kod },
    include: {
      rezervacija: {
        include: {
          kupac: true,
        },
      },
      kupac: true,
    },
  });
};

export const iskoristiPromoKodService = async (
  kod: string,
  kupacId: number
) => {
  const promo = await prisma.promo_kod.findUnique({ where: { kod } });

  if (!promo || promo.iskoriscen_od_kupca_id) {
    return null;
  }

  return await prisma.promo_kod.update({
    where: { kod },
    data: {
      iskoriscen_od_kupca_id: kupacId,
      status: "Iskorišćen",
    },
  });
};
