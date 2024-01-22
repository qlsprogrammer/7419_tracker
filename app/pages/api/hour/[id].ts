import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import  prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (req.method !== "DELETE") return res.status(400).json({ message: "Oops" });

  await prisma.shopHour.delete({
    where: {
      id: req.query.id as string,
    },
  });

  return res.json({ message: "deleted" });
}
