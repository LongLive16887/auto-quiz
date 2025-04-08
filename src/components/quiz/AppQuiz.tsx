import api from '@/api/axios'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup } from '@/components/ui/radio-group'
import { useQuizStore } from '@/store/quiz'
import { useWishlistStore } from '@/store/wishlist'
import { Answer, Question } from '@/types'
import { Loader2, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	useBlocker,
	useLocation,
	useNavigate,
	useParams,
} from 'react-router-dom'
import { Button } from '../ui/button'
import Tabs from './Tabs'

const AppQuiz = () => {
	const { id } = useParams()
	const { i18n, t } = useTranslation()
	const location = useLocation()
	const navigate = useNavigate()
	const TypeParam = new URLSearchParams(location.search).get('type')

	const {
		currentQuestionIndex,
		setCurrentQuestionIndex,
		userAnswers,
		submitAnswer,
		correctCount,
		incorrectCount,
		reset,
		quiz
	} = useQuizStore()

	const { wishlist, toggleWishlist } = useWishlistStore()

	// States
	const [showConfirm, setShowConfirm] = useState(false)
	const [showExitConfirm, setShowExitConfirm] = useState(false)
	const [openAccordion, setOpenAccordion] = useState<string | undefined>(
		undefined
	)

	const blocker = useBlocker(
		() => Object.keys(userAnswers).length < quiz.length
	)
	const currentQuestion = quiz[currentQuestionIndex]
	const isWishlisted = wishlist.some(q => q.id === currentQuestion?.id)

	// Effects
	useEffect(() => {
		if (quiz.length > 0) {
			setCurrentQuestionIndex(0)
			reset()
		}
	}, [quiz])

	useEffect(() => {
		setOpenAccordion(undefined)
	}, [currentQuestionIndex])

	useEffect(() => {
		if (blocker.state === 'blocked') {
			setShowExitConfirm(true)
			blocker.reset()
		}
	}, [blocker.state])

	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (Object.keys(userAnswers).length < quiz.length) {
				e.preventDefault()
				e.returnValue = '' 
			}
		}
	
		window.addEventListener('beforeunload', handleBeforeUnload)
	
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [userAnswers, quiz.length])
	

	// Helper Functions
	const getTranslationHTML = (
		prefix: 'question' | 'question_description' | 'answer',
		obj: Question | Answer
	) => {
		const langKey = `${prefix}_${i18n.language}` as keyof typeof obj
		const text = obj[langKey] || ''
		return { __html: text }
	}

	const handleAnswerSelect = (answer: Answer) => {
		if (!currentQuestion || userAnswers[currentQuestion.id]) return
		submitAnswer(currentQuestion.id, answer.id, answer.is_correct)
	}

	const submitQuizData = async () => {
		let type = 102

		if (TypeParam === 'test') {
			type = 105
		} else if (TypeParam === 'theme') {
			type = 100
		}
		const requestData = {
			type,
			external_id: id,
			correct_answer: correctCount,
			wrong_answer: incorrectCount,
			skipped_answer: quiz.length - Object.keys(userAnswers).length,
		}

		await api.post('/api/v1/user/statistics', requestData).then(res => {
			navigate('/results', { state: { data: res.data.data } })
		})
	}

	const handleFinishTest = () => {
		reset(true)
		submitQuizData()
	}

	const handleExitConfirm = (confirmed: boolean) => {
		setShowExitConfirm(false)
		if (confirmed) {
			reset(true)
			submitQuizData()
		}
	}

	// Loading State
	if (!currentQuestion)
		return (
			<Loader2
				color='white'
				size={70}
				className='animate-spin h-[calc(100vh-150px)] mx-auto'
			/>
		)

	return (
		<div className='flex flex-col h-[calc(100vh-110px)] gap-3.5'>
			{/* Header */}
			<div className='flex items-center px-3.5 justify-between flex-wrap'>
				{!TypeParam ? (
					<p className='text-2xl font-semibold text-white'>
						{id}-{t('bilet')}
					</p>
				) : null}
				<div className='flex items-center gap-3.5 ml-auto'>
					<Button
						size={'icon'}
						onClick={() =>
							currentQuestion && toggleWishlist(currentQuestion)
						}
					>
						<Star
							fill={isWishlisted ? 'yellow' : 'none'} 
							color='yellow'
							size={50}
						/>
					</Button>
					<Button
						variant='destructive'
						onClick={() => setShowConfirm(true)}
					>
						{t('finish')}
					</Button>
				</div>
			</div>

			{/* Question */}
			<div className='bg-white/10  backdrop-blur-md border p-3.5 rounded-lg'>
				<div
					className='w-full text-white text-center'
					dangerouslySetInnerHTML={getTranslationHTML(
						'question',
						currentQuestion
					)}
				/>
			</div>

			{/* Main Content */}
			<div className='flex-1 flex flex-wrap gap-3.5 items-start'>
				{/* Media */}
				<div className='flex-1 rounded-lg flex min-h-[250px] overflow-hidden'>
					{currentQuestion.media?.trim() ? (
						<img
							src={currentQuestion.media}
							alt='Question media'
							className='h-full max-w-full mx-auto object-contain'
						/>
					) : (
						<img
							className='mt-14 h-[300px] bg-white rounded-full w-[300px] mx-auto object-contain'
							src='/logo.png'
						/>
					)}
				</div>

				{/* Answers */}
				<div className='w-[500px]  px-3.5 rounded-lg flex flex-col'>
					<RadioGroup>
						{currentQuestion.answers.map((answer, i) => {
							const isSelected =
								userAnswers[currentQuestion.id]?.answerId === answer.id
							const isAnswered = !!userAnswers[currentQuestion.id]
							const isCorrectAnswer = answer.is_correct
							const isUserWrongAnswer =
								isSelected && !isCorrectAnswer && isAnswered
							const isCorrectHighlight = isCorrectAnswer && isAnswered

							return (
								<div
									key={answer.id}
									className={`flex items-center justify-between space-x-2 text-white rounded cursor-pointer bg-white/20 backdrop-blur-md
											${!isAnswered ? 'hover:bg-primary' : ''} 
								`}
									onClick={() => handleAnswerSelect(answer)}
								>
									<p
										className={`font-semibold leading-6 p-4 w-12 
									${isUserWrongAnswer ? 'bg-red-500 ' : ''} 
									${isCorrectHighlight ? 'bg-green-400' : ''}`}
									>
										F{i + 1}
									</p>
									<Label className='flex-1'>
										<div
											dangerouslySetInnerHTML={getTranslationHTML(
												'answer',
												answer
											)}
										/>
									</Label>
								</div>
							)
						})}
					</RadioGroup>

					{/* Question Description */}
					<Accordion
						type='single'
						value={openAccordion}
						onValueChange={setOpenAccordion}
						disabled={!userAnswers[currentQuestion.id]}
						collapsible
						className='w-full mt-auto text-white'
					>
						<AccordionItem value='item-1'>
							<AccordionTrigger>
								{i18n.language === 'ru' && 'Описание'}
								{i18n.language === 'uz' && 'Тавсиф'}
								{i18n.language === 'la' && 'Tavsif'}
							</AccordionTrigger>
							{userAnswers[currentQuestion.id] && (
								<AccordionContent className='' key={currentQuestion.id}>
									<div
										className='text-xs ans-description max-h-[200px] overflow-y-auto'
										dangerouslySetInnerHTML={getTranslationHTML(
											'question_description',
											currentQuestion
										)}
									/>
								</AccordionContent>
							)}
						</AccordionItem>
					</Accordion>
				</div>
			</div>

			{/* Navigation and Timer */}
			<div className='flex items-center justify-center gap-4 mt-auto mb-3'>
				<Tabs quantity={quiz.length} onTabChange={setCurrentQuestionIndex} />
			</div>

			{/* Finish Confirmation Modal */}
			<Dialog open={showConfirm} onOpenChange={setShowConfirm}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t('finish_test')}?</DialogTitle>
					</DialogHeader>
					<DialogFooter className='flex justify-center gap-2'>
						<Button onClick={handleFinishTest}>{t('yes')}</Button>
						<Button variant='outline' onClick={() => setShowConfirm(false)}>
							{t('no')}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Выход из теста */}
			<Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t('finish_test')}?</DialogTitle>
					</DialogHeader>
					<DialogFooter className='flex justify-center gap-2'>
						<Button onClick={() => handleExitConfirm(true)}>{t('yes')}</Button>
						<Button variant='outline' onClick={() => handleExitConfirm(false)}>
							{t('no')}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default AppQuiz
