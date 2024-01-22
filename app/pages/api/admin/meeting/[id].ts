import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { meetingSchema } from "@/lib/schemas";

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

  if (req.method === "DELETE") {
    await prisma.meeting.delete({
      where: {
        id: req.query.id as string,
      },
    });
    const meetings = await prisma.meeting.findMany();
    res.json(meetings);
  }

  if (req.method === "PUT") {
      req.body.hours = parseFloat(req.body.hours)
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

    await prisma.meeting.update({
      where: {
        id: req.query.id as string,
      },
      data: {
        date: req.body.date,
        hours: req.body.hours,
        name: req.body.name,
        code: req.body.code,
      },
    });
    const meetings = await prisma.meeting.findMany();
    res.json(meetings);
  }
}
