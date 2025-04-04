import api from '@/api/axios'
import { BlockData, Question } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type QuizStore = {
	quiz: Question[]
	loadQuiz: (id: number) => void
	loadFanQuiz: (id: number) => void
	loadTestQuiz: (quantity: string) => void
	activeLang: string
	setActiveLang: (lang: string) => void
	currentQuestionIndex: number
	setCurrentQuestionIndex: (index: number) => void
	userAnswers: Record<number, { answerId: number; isCorrect: boolean }>
	correctCount: number
	incorrectCount: number
	maxQuizCount: number
	submitAnswer: (
		questionId: number,
		answerId: number,
		isCorrect: boolean
	) => void
	reset: (clearQuiz?: boolean) => void
	statistics: BlockData[]
	setStatistics: (theme?: boolean) => void
}

export const useQuizStore = create<QuizStore>()(
	persist(
		set => ({
			quiz: [],
			maxQuizCount: 0,
			activeLang: 'la',
			currentQuestionIndex: 0,
			userAnswers: {},
			correctCount: 0,
			incorrectCount: 0,
			statistics: [],
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
					.get(
						`/api/v1/question?lessonId=${id}&page=0&size=1073741824`
					)
					.then(res => {
						set({ quiz: res.data.data.results })
					})
					.catch()
			},
			loadTestQuiz: quantity => {
				api
					.get(
						`/api/v1/question?page=0&size=${quantity}`
					)
					.then(res => {
						set({ quiz: res.data.data.results })
					})
					.catch()
			},
			setStatistics: theme => {
				api
					.get(`/api/v1/user/statistics?type=${theme ? 100 : 102}`)
					.then(res => {
						const { data } = res.data
						set({
							statistics: data,
							maxQuizCount: data.length,
						})
					})
					.catch(error => {
						console.error('Error fetching statistics:', error)
					})
			},
			setActiveLang: lang => set({ activeLang: lang }),
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
				activeLang: state.activeLang,
				correctCount: state.correctCount,
				incorrectCount: state.incorrectCount,
				maxQuizCount: state.maxQuizCount,
				userAnswers: state.userAnswers
			}),
		}
	)
)
