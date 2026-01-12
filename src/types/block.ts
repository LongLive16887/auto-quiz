
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

export type TrickBlockData = {
	id: number;
	correct_answer: number;
	wrong_answer: number;
	skipped_answer: number;
}


export type Video = {
	video_id: string,
}