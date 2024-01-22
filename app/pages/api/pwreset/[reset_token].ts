
import { NextApiRequest, NextApiResponse } from 'next';
import prisma  from '@/lib/prisma';
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(400).send("Oopsie")

  const token = req.query.reset_token as string
  console.log(req.body)

  try {
    const data: any = await jwt.verify(token, process.env.JWT_SECRET as string);
    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        password: await bcrypt.hash(req.body.password, 10)
      },
    });
    return res.send("Password updated");
  } catch (err: any) {
    return res.status(403).send("Invalid Token");
  }
}