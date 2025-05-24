export type Answer = {
	id: number
	answer_ru: string
	answer_uz: string
	answer_la: string
	is_correct: boolean
}

export type Question = {
	id: number
	group_id: number
	lesson_id: number
	question_ru: string
	question_uz: string
	question_la: string
	order_number: number
	is_reverse: boolean
	question_description_ru: string
	question_description_uz: string
	question_description_la: string
	has_video: boolean
	media: string | null
	web_media: string | null
	mobile_media: string | null
	answers: Answer[]
	audio_id?:string|null
}
