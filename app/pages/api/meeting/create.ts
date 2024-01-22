import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (session.user?.role !== "ADMIN")
    return res.status(401).json({ message: "You must be an admin." });
    if (req.method !== "POST") return res.status(400).json({ message: "Oops" });

    const { name, date, hours, code } = req.body;

    const newMeeting = await prisma.meeting.create({
      data: {
        name: name,
        date: date,
        hours: hours,
        code: code,
      },
    });

    res.status(200).json(newMeeting);
}
