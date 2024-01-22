import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { hourSchema } from "@/lib/schemas";

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

  if (req.method == "POST") {
    const response = hourSchema.safeParse(req.body);

    if (!response.success) {
      const { errors } = response.error;

      return res.status(400).json({
        error: {
          message: "Invalid",
          errors,
        },
      });
    }
    const result = await prisma.shopHour.create({
      data: {
        date: req.body.date,
        hours: req.body.hours,
        name: req.body.name,
        description: req.body.description,
        supervisor_name: req.body.supervisor_name,
        supervisor_contact: req.body.supervisor_contact,
        user: {
          connect: {
            id: req.query.id as string,
          },
        },
      },
    });
    const hours = await prisma.user.findMany({
      include: {
        hours: true,
        meetings: true
      },
    });
    return res.json(hours);
  }

  if (req.method === "DELETE") {
    await prisma.shopHour.delete({
      where: {
        id: req.query.id as string,
      },
    });
    const hours = await prisma.user.findMany({
      include: {
        hours: true,
        meetings: true
      },
    });
    res.json(hours);
  }

  if (req.method === "PUT") {
    const response = hourSchema.safeParse(req.body);

    if (!response.success) {
      const { errors } = response.error;

      return res.status(400).json({
        error: {
          message: "Invalid",
          errors,
        },
      });
    }

    await prisma.shopHour.update({
      where: {
        id: req.query.id as string,
      },
      data: {
        date: req.body.date,
        hours: req.body.hours,
        name: req.body.name,
        description: req.body.description,
        supervisor_name: req.body.supervisor_name,
        supervisor_contact: req.body.supervisor_contact,
        approved: req.body.approved
      },
    });
    const hours = await prisma.user.findMany({
      include: {
        hours: true,
        meetings: true
      },
    });
    res.json(hours);
  }

}
