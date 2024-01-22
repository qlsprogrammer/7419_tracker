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
    const meeting_id = req.query.meetingid as string;
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meeting_id,
      },
    });
    return res.status(200).json({ meeting });
  } else {
    if (req.method !== "GET") {
      const meeting_id = req.query.meetingid as string;
      let meeting = await prisma.meeting.findFirst({
        where: {
          id: meeting_id,
        },
      });
      return res.status(200).json({ meeting });
    } else {
      const meeting_id = req.query.meetingid as string;
      const dataToUpdate = req.body;
      let meeting = await prisma.meeting.update({
        where: {
          id: meeting_id,
        },
        data: dataToUpdate,
      });
      return res.status(200).json({ meeting });
    }
  }
}
