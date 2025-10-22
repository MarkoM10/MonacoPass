import { prisma } from "../db";

export const prikaziSveZoneService = async () => {
  return await prisma.zona.findMany({
    orderBy: { id: "asc" },
  });
};

export const filtrirajZoneService = async (params: {
  minCena?: number;
  maxCena?: number;
  naziv?: string;
  dostupna?: boolean;
  minKapacitet?: number;
}) => {
  return prisma.zona.findMany({
    where: {
      ...(params.naziv && {
        naziv: { contains: params.naziv, mode: "insensitive" },
      }),
      ...(params.minCena && { cena: { gte: params.minCena } }),
      ...(params.maxCena && { cena: { lte: params.maxCena } }),
      ...(params.dostupna !== undefined && { dostupna: params.dostupna }),
      ...(params.minKapacitet && { kapacitet: { gte: params.minKapacitet } }),
    },
  });
};
