import { z } from 'zod'

export const loginShema = z.object({
	username: z.string().min(1, { message: "Iltimos ma'lumot kiriting!" }),
	password: z
		.string()
		.min(1, { message: "Iltimos ma'lumot kiriting!" })
		.min(6, { message: "Parol kamida 6 ta belgi bo'lishi kerak!" }),
})
