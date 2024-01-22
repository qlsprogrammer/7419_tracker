import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { userSchema } from "@/lib/schemas";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (session && session.user) {
    res.status(401).json({ message: "Rate limit exceeded" });
    return;
  }

  if (req.method !== "POST") return res.status(400).json({ message: "oops" });

  const response = userSchema.safeParse(req.body);

  if (!response.success) {
    const { errors } = response.error;

    return res.status(400).json({
      message: errors.map((error) => error.message).join(", ")
    });
  }

  const conflicts = await prisma.user.findUnique({
    where: {
        email: req.body.email
    }
  })

  if (conflicts) return res.status(400).json({ message: "User with that email already exists"})

  const result = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
    },
  });

  return res.json({ message: "User created successfully" });
}
