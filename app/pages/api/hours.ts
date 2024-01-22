import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from './auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import prisma  from '@/lib/prisma';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (req.method !== "GET") return res.status(400).json({message: "Oops"})

  const hours = await prisma.shopHour.findMany({
    where: {
      userId: session.user!.id
    }
  })

  return res.json(hours)

}