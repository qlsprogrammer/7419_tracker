import { z } from "zod";

export const hourSchema = z.object({
    date: z.preprocess( arg => typeof arg == 'string' ? new Date( arg ) : undefined, z.date() ),
    hours: z.coerce.number(),
    name: z.string(),
    description: z.string(),
    supervisor_name: z.string(),
    supervisor_contact: z.string()
})

export const meetingSchema = z.object({
    date: z.preprocess( arg => typeof arg == 'string' ? new Date( arg ) : undefined, z.date() ),
    name: z.string(),
    hours: z.number(),
    code: z.string(),
})

export const userSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(2)
})