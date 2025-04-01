import api from '@/api/axios'
import { Question } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type QuizStore = {
	quiz: Question[]
	loadQuiz: (id: number) => void
  loadFanQuiz: (id: number) => void
	activeLang: string
	setActiveLang: (lang: string) => void
	currentQuestionIndex: number
	setCurrentQuestionIndex: (index: number) => void
	userAnswers: Record<number, { answerId: number; isCorrect: boolean }>
	correctCount: number
	incorrectCount: number
	submitAnswer: (
		questionId: number,
		answerId: number,
		isCorrect: boolean
	) => void
	reset: (clearQuiz?: boolean) => void
}

export const useQuizStore = create<QuizStore>()(
	persist(
		set => ({
			quiz: [],
			activeLang: 'la',
			currentQuestionIndex: 0,
			userAnswers: {},
			correctCount: 0,
			incorrectCount: 0,
			loadQuiz: id => {
				api
					.get(`/api/v1/question?groupId=${id}&page=1073741824&size=1073741824`)
					.then(res => {
						set({ quiz: res.data.data.results })
					})
					.catch(error => {
						console.error('Error loading quiz:', error)
					})
			},
      loadFanQuiz: id => {
				api
					.get(`/api/v1/question?lessonId=${id}&page=1073741824&size=1073741824`)
					.then(res => {
						set({ quiz: res.data.data.results })
					})
					.catch(error => {
						console.error('Error loading quiz:', error)
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
			}),
		}
	)
)
