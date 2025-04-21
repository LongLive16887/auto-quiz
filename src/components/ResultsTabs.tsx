import api from '@/api/axios'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BlockData, Question } from '@/types'
import { Check, CircleAlert, Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from './ui/badge'

const ResultsTabs = ({ studentId }: { studentId: number }) => {
	const { t, i18n } = useTranslation()
	const [statistics, setStatistics] = useState<BlockData[]>([])
	const [savedQuestions, setSavedQuestions] = useState<Question[]>([])
	const [activeTab, setActiveTab] = useState('shablon')
	const [loading, setLoading] = useState(false)

	const getStats = (tab: string) => {
		setLoading(true)

		let url = ''
		switch (tab) {
			case 'shablon':
				url = `/api/v1/user/statistics/by-id?typeId=102&userId=${studentId}`
				api
					.get(url)
					.then(res => setStatistics(res.data.data))
					.finally(() => setLoading(false))
				break
			case 'fan':
				url = `/api/v1/user/statistics/by-id?typeId=100&userId=${studentId}`
				api
					.get(url)
					.then(res => setStatistics(res.data.data))
					.finally(() => setLoading(false))
				break
			case 'saved':
				url = `/api/v1/wishlist/user/by-id?userId=${studentId}`
				api
					.get(url)
					.then(res => setSavedQuestions(res.data.data))
					.finally(() => setLoading(false))
				break
		}
	}

	useEffect(() => {
		getStats(activeTab)
	}, [activeTab])

	const getLanguageName = (item: BlockData) => {
		switch (i18n.language) {
			case 'uz':
				return item.name_uz
			case 'la':
				return item.name_la
			case 'ru':
				return item.name_ru
			default:
				return item.name_uz
		}
	}

	const getTranslationHTML = (
		prefix: 'question' | 'question_description' | 'answer',
		obj: Question
	) => {
		const langKey = `${prefix}_${i18n.language}` as keyof Question
		const text = obj[langKey] || ''
		return { __html: text }
	}

	return (
		<div>
			<Tabs defaultValue='shablon' onValueChange={setActiveTab}>
				<TabsList className='mb-3.5'>
					<TabsTrigger value='shablon'>{t('shablon_test')}</TabsTrigger>
					<TabsTrigger value='fan'>{t('theme_test')}</TabsTrigger>
					<TabsTrigger value='saved'>{t('saved')}</TabsTrigger>
				</TabsList>

				<TabsContent value='shablon'>
					{loading ? (
						<div className='flex justify-center items-center min-h-[200px]'>
							<Loader2 className='animate-spin' size={62} color='white' />
						</div>
					) : (
						<div className='flex flex-wrap justify-center gap-2'>
							{statistics.map((item, index) => (
								<div
									key={index}
									className='flex flex-col relative bg-white/10 backdrop-blur-lg text-white items-center justify-center py-10 cursor-pointer gap-2 max-w-[150px] w-full rounded-lg border hover:shadow-sm transition'
								>
									<p className='text-sm'>
										{item.id} - {t('bilet')}
									</p>
									{item.correct_answer !== 0 &&
									item.wrong_answer === 0 &&
									item.skipped_answer === 0 ? (
										<div className='flex items-center gap-1 absolute top-1 right-1'>
											<Badge variant='succes'>
												<Check size={15} />
												<span className='text-xs'>{item.correct_answer}</span>
											</Badge>
										</div>
									) : item.correct_answer !== 0 ||
									  item.wrong_answer !== 0 ||
									  item.skipped_answer !== 0 ? (
										<div className='flex items-center gap-1 absolute top-1 right-1'>
											{item.skipped_answer > 0 && (
												<Badge variant='warn'>
													<CircleAlert size={15} />
													<span className='text-xs'>{item.skipped_answer}</span>
												</Badge>
											)}
											{item.correct_answer > 0 && (
												<Badge variant='succes'>
													<Check size={15} />
													<span className='text-xs'>{item.correct_answer}</span>
												</Badge>
											)}
											{item.wrong_answer > 0 && (
												<Badge variant='error'>
													<X size={15} />
													{item.wrong_answer}
												</Badge>
											)}
										</div>
									) : null}
								</div>
							))}
						</div>
					)}
				</TabsContent>

				<TabsContent value='fan'>
					{loading ? (
						<div className='flex justify-center items-center min-h-[200px]'>
							<Loader2 className='animate-spin' size={62} color='white' />
						</div>
					) : (
						<div className='flex justify-center flex-wrap gap-4'>
							{statistics.map((data, index) => (
								<div
									key={index}
									className='flex relative justify-center items-center p-2 bg-white/10 backdrop-blur-lg text-white cursor-pointer gap-4 max-w-[370px] min-h-[300px] w-full border rounded-lg hover:shadow-sm transition'
								>
									<p
										className='text-center'
										dangerouslySetInnerHTML={{ __html: getLanguageName(data) }}
									></p>
									{data.correct_answer != 0 &&
									data.wrong_answer === 0 &&
									data.skipped_answer === 0 ? (
										<div className='flex items-center gap-1 absolute top-1 right-1'>
											<Badge variant='succes'>
												<Check size={15} /> {data.correct_answer}
											</Badge>
										</div>
									) : data.correct_answer !== 0 ||
									  data.wrong_answer !== 0 ||
									  data.skipped_answer !== 0 ? (
										<div className='flex items-center gap-1 absolute top-1 right-1'>
											{data.skipped_answer > 0 && (
												<Badge variant='warn'>
													<CircleAlert size={15} /> {data.skipped_answer}
												</Badge>
											)}
											{data.correct_answer > 0 && (
												<Badge variant='succes'>
													<Check size={15} /> {data.correct_answer}
												</Badge>
											)}
											{data.wrong_answer > 0 && (
												<Badge variant='error'>
													<X size={15} /> {data.wrong_answer}
												</Badge>
											)}
										</div>
									) : null}
								</div>
							))}
						</div>
					)}
				</TabsContent>

				<TabsContent value='saved'>
					{loading ? (
						<div className='flex justify-center items-center min-h-[200px]'>
							<Loader2 className='animate-spin' size={62} color='white' />
						</div>
					) : savedQuestions.length === 0 ? (
						<div className='text-white text-center min-h-[200px] flex items-center justify-center'>
							<p className='text-xl'>{t('Saqlanganlar yoq')}</p>
						</div>
					) : (
						<div className='flex flex-wrap gap-4 justify-center'>
							{savedQuestions.map(question => (
								<div
									key={question.id}
									className='relative flex flex-col md:flex-row w-full bg-white/10 backdrop-blur-lg p-4 rounded-lg shadow-md text-white gap-4'
								>
									{/* Левая часть */}
									<div className='w-full md:w-80 flex flex-col'>
										<div
											className='text-sm mb-2'
											dangerouslySetInnerHTML={getTranslationHTML(
												'question',
												question
											)}
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
											<img
												className='h-40 bg-white w-fit mx-auto rounded-full object-contain mb-2'
												src='/logo.png'
												alt='Logo'
											/>
										)}

										<div className='space-y-1 pt-2 overflow-y-auto pr-2 scroll-smooth'>
											{question.answers?.map((answer, index) => (
												<div
													key={index}
													className={`px-3 py-2 rounded-md text-xs ${
														answer.is_correct
															? 'bg-green-600 text-white'
															: 'bg-white/20 text-white'
													}`}
													dangerouslySetInnerHTML={{
														__html:
															(answer as any)[`answer_${i18n.language}`] || '',
													}}
												/>
											))}
										</div>
									</div>

									{/* Правая часть: описание */}
									<div className='flex-1 text-sm text-gray-200 p-2 border-t md:border-t-0 md:border-l border-white/20'>
										<p className='text-sm font-semibold mb-2'>
											{i18n.language === 'ru' && 'Описание'}
											{i18n.language === 'uz' && 'Тавсиф'}
											{i18n.language === 'la' && 'Tavsif'}
										</p>
										<div
											className='text-sm leading-relaxed max-h-60 overflow-y-auto scroll-smooth'
											dangerouslySetInnerHTML={getTranslationHTML(
												'question_description',
												question
											)}
										/>
									</div>
								</div>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default ResultsTabs
