import api from '@/api/axios'
import { Question } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type QuizStore = {
	quiz: Question[]
	loadQuiz: (id: number) => void
	loadTrickQuiz: (id: number) => void
	loadFanQuiz: (id: number) => void
	loadDigitalQuiz: (id: number) => void
	loadTestQuiz: (quantity: string) => void
	currentQuestionIndex: number
	setCurrentQuestionIndex: (index: number) => void
	userAnswers: Record<number, { answerId: number; isCorrect: boolean }>
	correctCount: number
	incorrectCount: number
	maxQuizCount: number
	setMaxQuizCount: (quantity: number) => void
	submitAnswer: (
		questionId: number,
		answerId: number,
		isCorrect: boolean
	) => void
	reset: (clearQuiz?: boolean) => void
	showNext: boolean
	setShowNext: (show: boolean) => void
}

export const useQuizStore = create<QuizStore>()(
	persist(
		set => ({
			quiz: [],
			maxQuizCount: 0,
			currentQuestionIndex: 0,
			userAnswers: {},
			correctCount: 0,
			incorrectCount: 0,
			showNext: false,
			loadQuiz: id => {
				api
					.get(`/api/v1/question?groupId=${id}&page=0&size=1073741824`)
					.then(res => {
						set({ quiz: res.data.data.results })
					})
					.catch()
			},
			loadFanQuiz: id => {
				api
					.get(`/api/v1/question?lessonId=${id}&page=0&size=1073741824`)
					.then(res => {
						set({ quiz: res.data.data.results })
					})
					.catch()
			},
			loadTrickQuiz: id => {
				api
					.get(`/api/v1/question?type=HARD&page=${id}&size=50`)
					.then(res => {
						set({ quiz: res.data.data.results })
					})
					.catch()
			},
			loadDigitalQuiz: id => {
				api
					.get(`/api/v1/question?mobileType=HARD&page=${id}&size=50`)
					.then(res => {
						set({ quiz: res.data.data.results })
					})
					.catch()
			},
			loadTestQuiz: quantity => {
				api
					.get(`/api/v1/question?page=0&size=${quantity}`)
					.then(res => {
						set({ quiz: res.data.data.results })
					})
					.catch()
			},
			setShowNext: show => set({ showNext: show }),
			setMaxQuizCount: quantity => set({ maxQuizCount: quantity }),
			setCurrentQuestionIndex: index => set({ currentQuestionIndex: index }),
			submitAnswer: (questionId, answerId, isCorrect) =>
				set(state => ({
					userAnswers: {
						...state.userAnswers,
						[questionId]: { answerId, isCorrect },
					},
					correctCount: isCorrect ? state.correctCount + 1 : state.correctCount,
					incorrectCount: !isCorrect
						? state.incorrectCount + 1
						: state.incorrectCount,
				})),
			reset: (clearQuiz = false) =>
				set(state => ({
					quiz: clearQuiz ? [] : state.quiz,
					userAnswers: {},
					correctCount: 0,
					incorrectCount: 0,
					currentQuestionIndex: 0,
				})),
		}),
		{
			name: 'Quiz',
			partialize: state => ({
				quiz: state.quiz,
				correctCount: state.correctCount,
				incorrectCount: state.incorrectCount,
				maxQuizCount: state.maxQuizCount,
				showNext: state.showNext
			}),
		}
	)
)
