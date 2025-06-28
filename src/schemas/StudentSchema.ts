import { z } from 'zod'
export const studentSchema = z
	.object({
		username: z.string().min(1, { message: "Iltimos, login kiriting!" }),
		full_name: z.string().min(1, { message: "Iltimos, to'liq ismingizni kiriting!" }),
		password: z
			.string()
			.min(1, { message: "Iltimos, parol kiriting!" })
			.min(8, { message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak!" }),
		confirm_password: z.string(),
		expiration_date: z.string().min(1, { message: "Iltimos, tugash vaqtini kiriting!" }),
		device_id_length: z
			.number({
				required_error: "Iltimos, device ID uzunligini kiriting!",
				invalid_type_error: "Faqat son kiriting!",
			})
			.int()
			.min(1, { message: "Eng kamida 1 bo'lishi kerak!" })
			.max(20, { message: "Eng ko'pi bilan 20 bo'lishi kerak!" }),
	})
