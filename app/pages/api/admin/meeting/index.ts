import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { hourSchema, meetingSchema } from "@/lib/schemas";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (session.user.role == "USER") return res.status(401).json({message: "Not an Admin"})
  
  if (req.method === "GET") {
    const meetings = await prisma.meeting.findMany();
    res.json(meetings)
  }
  
  if (req.method == "POST") {
    const response = meetingSchema.safeParse(req.body);

    if (!response.success) {
      const { errors } = response.error;

      return res.status(400).json({
        error: {
          message: "Invalid",
          errors,
        },
      });
    }
    const result = await prisma.meeting.create({
      data: {
        date: req.body.date,
        hours: req.body.hours,
        name: req.body.name,
        code: req.body.code,
      },
    });
    const meetings = await prisma.meeting.findMany();
    return res.json(meetings);
  
  }
}