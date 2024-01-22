import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import  prisma  from "@/lib/prisma";
import jwt from "jsonwebtoken"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== "GET") return res.status(400).json({ message: "Oops" });

  const token = req.query.id as string

  try {
    const data: any = await jwt.verify(token, process.env.JWT_SECRET as string);
    await prisma.shopHour.update({
      where: {
        id: data.hourid,
      },
      data: {
        approved: true,
      },
    });
    return res.send("Thank you for verifying volunteer hours");
  } catch (err: any) {
    return res.status(403).send("Invalid Token");
  }

}
