export type BlockData = {
	id: number
	correct_answer: number
	name_la: number
	name_uz: number
	name_ru: number
	skipped_answer: number
	wrong_answer: number
	video_id?: string | null,
	videos?: object[]
}

export type Video = {
		"id": number,
		"video_id": string,
		"title_uz": null,
		"title_ru": null,
		"title_la": string,
		"num": null
	
}