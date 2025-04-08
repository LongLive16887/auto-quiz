import { z } from 'zod'

export const studentPasswordSchema = z
	.object({
		username: z.string().min(1, { message: 'Iltimos, login kiriting!' }),
		password: z
			.string()
			.min(1, { message: 'Iltimos, parol kiriting!' })
			.min(8, { message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak!" }),
		confirm_password: z.string()
	})
