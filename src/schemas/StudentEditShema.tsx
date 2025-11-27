import { z } from 'zod'

export const studentEditSchema = z
	.object({
		id: z.number(),
		username: z.string().min(1, { message: "Iltimos, login kiriting!" }),
		full_name: z.string().min(1, { message: "Iltimos, to'liq ismingizni kiriting!" }),
		expiration_date: z.string().min(1, { message: "Iltimos, tugash vaqtini kiriting!" }),
		phone_number: z.string(),
		device_id_length: z
		.number({
			required_error: "Iltimos, device ID uzunligini kiriting!",
			invalid_type_error: "Faqat son kiriting!",
		})
		.int()
		.min(1, { message: "Eng kamida 1 bo'lishi kerak!" })
		.max(20, { message: "Eng ko'pi bilan 20 bo'lishi kerak!" }),
	})
