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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useQuizStore } from '@/store/quiz'
import { Answer, Question } from '@/types'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useBlocker, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../ui/button'
import Tabs from './Tabs'

type AppQuizProps = {
	quiz: Question[]
}

const AppQuiz = ({ quiz }: AppQuizProps) => {
	const { id } = useParams()
	const navigate = useNavigate()
	const {
		activeLang,
		setActiveLang,
		currentQuestionIndex,
		setCurrentQuestionIndex,
		userAnswers,
		submitAnswer,
		correctCount,
		incorrectCount,
		reset,
	} = useQuizStore()

	const [showConfirm, setShowConfirm] = useState(false)
	const [showExitConfirm, setShowExitConfirm] = useState(false)

	const blocker = useBlocker(
		() => Object.keys(userAnswers).length < quiz.length
	)
	const currentQuestion = quiz[currentQuestionIndex]

	const getTranslationHTML = (
		prefix: 'question' | 'question_description' | 'answer',
		obj: Question | Answer
	) => {
		const langKey = `${prefix}_${activeLang}` as keyof typeof obj
		const text = obj[langKey] || ''
		return { __html: text }
	}

	const handleAnswerSelect = (answer: Answer) => {
		if (!currentQuestion || userAnswers[currentQuestion.id]) return
		submitAnswer(currentQuestion.id, answer.id, answer.is_correct)
	}

	const handleFinishTest = () => {
		reset(true)
		setTimeout(
			() =>
				navigate('/results', {
					state: { correctCount, incorrectCount, total: quiz.length },
				}),
			0
		)
	}

	const handleExitConfirm = (confirmed: boolean) => {
		setShowExitConfirm(false)
		if (confirmed) {
			reset(true)
			setTimeout(
				() =>
					navigate('/results', {
						state: { correctCount, incorrectCount, total: quiz.length },
					}),
				0
			)
		}
	}



	useEffect(() => {
		if (quiz.length > 0) {
			setCurrentQuestionIndex(0)
			reset()
		}
	}, [quiz])

	useEffect(() => {
		if (blocker.state === 'blocked') {
			setShowExitConfirm(true)
			blocker.reset()
		}
	}, [blocker.state])

	useEffect(() => {
		const handlePopState = () => {
			if (Object.keys(userAnswers).length < quiz.length) {
				setShowExitConfirm(true)
				navigate(location.pathname, { replace: true })
			}
		}

		window.addEventListener('popstate', handlePopState)
		return () => window.removeEventListener('popstate', handlePopState)
	}, [location.pathname])

	if (!currentQuestion)
		return (
			<Loader2
				size={70}
				className='animate-spin h-[calc(100vh-150px)] mx-auto'
			/>
		)

	return (
		<div className='flex flex-col h-[calc(100vh-110px)] gap-3.5'>
			{/* Header */}
			<div className='flex items-center px-3.5 justify-between flex-wrap'>
				<p className='text-2xl font-semibold'>{id}-Bilet</p>
				<div className='flex items-center gap-2'>
					{['la', 'uz', 'ru'].map(lang => (
						<Button
							key={lang}
							variant={activeLang === lang ? 'default' : 'outline'}
							onClick={() => setActiveLang(lang)}
						>
							{lang === 'la' && 'Latin'}
							{lang === 'uz' && 'Uzbek'}
							{lang === 'ru' && 'Russian'}
						</Button>
					))}
				</div>
				<Button
					variant='destructive'
					className='self-center'
					onClick={() => setShowConfirm(true)}
				>
					Yakunlash
				</Button>
			</div>

			{/* Question */}
			<div className='bg-white p-3.5 rounded-lg'>
				<div
					className='w-full text-center'
					dangerouslySetInnerHTML={getTranslationHTML(
						'question',
						currentQuestion
					)}
				/>
			</div>

			{/* Main Content */}
			<div className='flex-1 flex flex-wrap gap-3.5 items-stretch'>
				{/* Media */}
				<div className='photo-container flex-1 bg-white rounded-lg flex items-center justify-center min-h-[250px]'>
					{currentQuestion.media?.trim() ? (
						<img
							src={currentQuestion.media}
							alt='Question media'
							className='max-h-[600px] max-w-full object-contain'
						/>
					) : (
						<img className='w-[400px] h-[400px]' src='/logo.png' />
					)}
				</div>

				{/* Answers */}
				<div className='question-container w-[500px] bg-white p-3.5 rounded-lg flex flex-col'>
					<RadioGroup>
						{currentQuestion.answers.map(answer => {
							const isSelected =
								userAnswers[currentQuestion.id]?.answerId === answer.id
							const isAnswered = !!userAnswers[currentQuestion.id]
							const isCorrectAnswer = currentQuestion.answers.some(
								a => a.is_correct && a.id === answer.id
							)

							return (
								<div
									key={answer.id}
									className={`flex items-start space-x-2 p-2 rounded ${
										isAnswered
											? isCorrectAnswer
												? 'bg-green-50 border border-green-200'
												: 'bg-red-50 border border-red-200'
											: ''
									} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
								>
									<RadioGroupItem
										value={answer.id.toString()}
										id={`answer-${answer.id}`}
										checked={isSelected}
										onClick={() => handleAnswerSelect(answer)}
										disabled={isAnswered}
									/>
									<Label htmlFor={`answer-${answer.id}`} className='flex-1'>
										<div
											dangerouslySetInnerHTML={getTranslationHTML(
												'answer',
												answer
											)}
											className={
												isAnswered && !isCorrectAnswer ? 'text-red-600' : ''
											}
										/>
									</Label>
								</div>
							)
						})}
					</RadioGroup>

					{/* Question Description */}
					<Accordion type='single' collapsible className='w-full mt-auto'>
						<AccordionItem value='item-1'>
							<AccordionTrigger>
								{activeLang === 'ru' && 'Описание'}
								{activeLang === 'uz' && 'Тавсиф'}
								{activeLang === 'la' && 'Tavsif'}
							</AccordionTrigger>
							<AccordionContent>
								<div
									className='text-xs'
									dangerouslySetInnerHTML={getTranslationHTML(
										'question_description',
										currentQuestion
									)}
								/>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</div>

			{/* Navigation and Timer */}
			<div className='flex items-center justify-center gap-4 mt-auto'>
				<Tabs quantity={quiz.length} onTabChange={setCurrentQuestionIndex} />
			</div>

			{/* Finish Confirmation Modal */}
			<Dialog open={showConfirm} onOpenChange={setShowConfirm}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Testni yakunlashni istaysizmi?</DialogTitle>
					</DialogHeader>
					<DialogFooter className='flex justify-center gap-2'>
						<Button onClick={handleFinishTest} variant='destructive'>
							Ha
						</Button>
						<Button variant='outline' onClick={() => setShowConfirm(false)}>
							Yo'q
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Выход из теста */}
			<Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Testni yakunlashni istaysizmi?</DialogTitle>
					</DialogHeader>
					<DialogFooter className='flex justify-center gap-2'>
						<Button
							variant='destructive'
							onClick={() => handleExitConfirm(true)}
						>
							Ha
						</Button>
						<Button variant='outline' onClick={() => handleExitConfirm(false)}>
							Davom etish
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default AppQuiz
