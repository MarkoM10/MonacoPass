import { prisma } from "../db";

export const prikaziSveZoneService = async () => {
  return await prisma.zona.findMany({
    orderBy: { id: "asc" },
  });
};
