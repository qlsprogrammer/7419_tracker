/*
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

  if (session.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "You must be an admin." });
  } else {
    if (req.method !== "GET") return res.status(400).json({ message: "Oops" });

    const { meeting_id } = req.body;

    let meeting = await prisma.meeting.findFirst({
      where: {
        id: meeting_id,
      },
    });

    let attendees = meeting.attendees;
    return res.status(200).json({ attendees });
  }
}
*/