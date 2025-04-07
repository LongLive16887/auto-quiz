import { z } from 'zod'

export const studentSchema = z
	.object({
		username: z.string().min(1, { message: "Iltimos, login kiriting!" }),
		full_name: z.string().min(1, { message: "Iltimos, to'liq ismingizni kiriting!" }),
		password: z
			.string()
			.min(1, { message: "Iltimos, parol kiriting!" })
			.min(8, { message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak!" }),
		confirm_password: z
			.string()
			.min(1, { message: "Iltimos, parolni tasdiqlang!" })
			.min(8, { message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak!" }),
		expiration_date: z.string().min(1, { message: "Iltimos, tugash vaqtini kiriting!" }),
	})
	.refine(data => data.password === data.confirm_password, {
		path: ['confirm_password'],
		message: 'Parollar mos emas!',
	})
