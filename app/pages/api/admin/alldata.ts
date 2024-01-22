import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (session.user.role == "USER")
    return res.status(401).json({ message: "Not an Admin" });

  const hours = await prisma.user.findMany({
    include: {
      hours: true,
      meetings: true
    },
  });
  res.json(hours);
}
