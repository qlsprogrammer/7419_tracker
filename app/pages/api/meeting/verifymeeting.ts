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

  const user_id = session.user!.id;

  const { meeting_id, code } = req.body;

  if (meeting_id == null || code == null) return res.status(400).json({message: "Missing Meeting Name/Code"})

  const meeting = await prisma.meeting.findUnique({
    where: {
      id: meeting_id,
    },
  });

  console.log(meeting)
  if (meeting == null) return res.status(404).json({ message: "Ooops" });
  if (code !== meeting.code)
    return res.status(400).json({ message: "Incorrect Code" });

  await prisma.meeting.update({
    where: {
      id: meeting_id,
    },
    data: {
      attendees: {
        connect: {
          id: user_id,
        },
      },
    },
  });
  const data = {
    name: meeting.name,
    date: meeting.date,
    id: meeting.id,
    hours: meeting.hours,
  };

  return res.status(200).json({ message: "Meeting verified", data: data });
}
