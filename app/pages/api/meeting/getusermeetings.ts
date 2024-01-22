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

  // if (type_meeting === "notattended") {
  //   meetings = await prisma.meeting.findMany({
  //     where: {
  //       attendees: {
  //         none: {
  //           id: user_id,
  //         },
  //       },
  //     },
  //   });
  //   return res.status(200).json({ meetings });
  // } else {
    const meetings = await prisma.meeting.findMany({
      where: {
        attendees: {
          some: {
            id: session.user!.id,
          },
        },
      },
    });
    return res.status(200).json({ meetings });
  // }
}
