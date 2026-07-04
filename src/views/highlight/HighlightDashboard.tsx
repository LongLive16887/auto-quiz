import api from '@/api/axios'
import { HighlightTestBlock } from '@/components/HighlightTestBlock'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import MainLayout from '@/layouts/MainLayout'
import { useQuizStore } from '@/store/quiz'
import { Answer, Question } from '@/types'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const QUESTIONS_PER_BLOCK = 45

function createBlocks(length: number): { id: number }[] {
	return Array.from({ length }).map((_, index) => ({ id: index }))
}

const HighlightDashboard = () => {
	const [questions, setQuestions] = useState<Question[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [testMode, setTestMode] = useState(false)
	const [blocks, setBlocks] = useState<{ id: number }[]>([])
	const { i18n, t } = useTranslation()
	const navigate = useNavigate()
	const { setQuiz } = useQuizStore()

	useEffect(() => {
		setIsLoading(true)
		api
			.get('/api/v1/question?is_highlight=true&size=1073741824')
			.then(res => {
				const data: Question[] = res.data.data.results || []
				setQuestions(data)
				setBlocks(createBlocks(Math.max(1, Math.ceil(data.length / QUESTIONS_PER_BLOCK))))
			})
			.finally(() => setIsLoading(false))
	}, [])

	const getHighlightHTML = (prefix: 'question' | 'answer', obj: Question | Answer) => {
		const record = obj as Record<string, unknown>
		const highlighted = record[`${prefix}_${i18n.language}_highlight`] as string | null
		if (highlighted) return { __html: highlighted }
		return { __html: (record[`${prefix}_${i18n.language}`] as string) || '' }
	}

	const onStartTest = (blockId: number) => {
		const slice = questions.slice(blockId * QUESTIONS_PER_BLOCK, (blockId + 1) * QUESTIONS_PER_BLOCK)
		if (!slice.length) return
		setQuiz(slice)
		navigate(`/template/${blockId}?type=highlight`)
	}

	if (isLoading) {
		return (
			<MainLayout>
				<Loader2 color='white' size={70} className='animate-spin h-[calc(100vh-150px)] mx-auto' />
			</MainLayout>
		)
	}

	if (!questions.length) {
		return (
			<MainLayout>
				<p className='text-white h-[calc(100vh-150px)] mx-auto'>Muhim savol yo'q</p>
			</MainLayout>
		)
	}

	return (
		<MainLayout>
			<div className='p-4'>
				<div className='flex items-center justify-end text-white mb-4'>
					<div className='flex items-center gap-2'>
						<span>{t('test_mode')}</span>
						<Switch checked={testMode} onCheckedChange={setTestMode} />
					</div>
				</div>
				{testMode ? (
					<div className='flex justify-center flex-wrap gap-3.5'>
						{blocks.map(block => (
							<HighlightTestBlock key={block.id} data={block} onStartTest={onStartTest} />
						))}
					</div>
				) : (
					<div className='flex flex-wrap gap-4 justify-center'>
						{questions.map(question => (
							<div
								key={question.id}
								className='relative flex flex-col md:flex-row w-full bg-white/10 backdrop-blur-lg p-4 rounded-lg shadow-md text-white gap-4'
							>
								<div className='w-full md:w-80 flex flex-col'>
									<div
										className='text-sm mb-2'
										dangerouslySetInnerHTML={getHighlightHTML('question', question)}
									/>
									{question.mobile_media ? (
										<Dialog>
											<DialogTrigger asChild>
												<img
													src={`https://backend.avtotest-begzod.uz/api/v1/file/download/${question.mobile_media}`}
													alt='Question'
													className='w-full h-40 object-cover rounded-md mb-2 cursor-pointer'
												/>
											</DialogTrigger>
											<DialogContent className='max-w-4xl p-0 bg-transparent border-none shadow-none'>
												<img
													src={`https://backend.avtotest-begzod.uz/api/v1/file/download/${question.mobile_media}`}
													alt='Full view'
													className='w-full h-auto rounded-lg object-cover max-h-[80vh]'
												/>
											</DialogContent>
										</Dialog>
									) : (
										<div className='h-40 bg-white w-40 mx-auto rounded-full mb-2'>
											<img className='h-full w-full object-contain' src='/logo.png' alt='Logo' />
										</div>
									)}
									<div className='space-y-1 pt-2 overflow-y-auto pr-2'>
										{question.answers.map((answer, index) => (
											<div
												key={index}
												className={`px-3 py-2 rounded-md text-xs ${
													answer.is_correct ? 'bg-green-600 text-white' : 'bg-white/20 text-white'
												}`}
												dangerouslySetInnerHTML={getHighlightHTML('answer', answer)}
											/>
										))}
									</div>
								</div>
								<div className='flex-1 text-sm text-gray-200 p-2 border-t md:border-t-0 md:border-l border-white/20'>
									<p className='text-sm font-semibold mb-2'>
										{i18n.language === 'ru' && 'Описание'}
										{i18n.language === 'uz' && 'Тавсиф'}
										{i18n.language === 'la' && 'Tavsif'}
									</p>
									<div
										className='text-sm leading-relaxed max-h-60 overflow-y-auto'
										dangerouslySetInnerHTML={{
											__html:
												(question[`question_description_${i18n.language}` as keyof Question] as string) || '',
										}}
									/>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</MainLayout>
	)
}

export default HighlightDashboard
