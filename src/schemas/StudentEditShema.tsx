import { z } from 'zod'

export const studentEditSchema = z
	.object({
		id: z.number(),
		username: z.string().min(1, { message: "Iltimos, login kiriting!" }),
		full_name: z.string().min(1, { message: "Iltimos, to'liq ismingizni kiriting!" }),
		expiration_date: z.string().min(1, { message: "Iltimos, tugash vaqtini kiriting!" }),
	})
