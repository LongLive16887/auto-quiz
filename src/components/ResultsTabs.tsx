import api from '@/api/axios'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BlockData } from '@/types'
import { Check, CircleAlert, Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from './ui/badge'

const ResultsTabs = ({ studentId }: { studentId: number }) => {
	const { t, i18n } = useTranslation()
	const [statistics, setStatistics] = useState<BlockData[]>([])
	const [activeTab, setActiveTab] = useState('account')
	const [loading, setLoading] = useState(false)

	const getStats = (typeId: number) => {
		setLoading(true)
		api
			.get(`/api/v1/user/statistics/by-id?typeId=${typeId}&userId=${studentId}`)
			.then(res => {
				setStatistics(res.data.data)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	useEffect(() => {
		getStats(activeTab === 'account' ? 102 : 100)
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

	return (
		<div>
			<Tabs defaultValue='account' onValueChange={setActiveTab}>
				<TabsList className='mb-3.5'>
					<TabsTrigger value='account'>{t('shablon_test')}</TabsTrigger>
					<TabsTrigger value='password'>{t('theme_test')}</TabsTrigger>
				</TabsList>

				<TabsContent value='account'>
					{loading ? (
						<div className='flex justify-center items-center min-h-[200px]'>
							<Loader2 className='animate-spin' size={62} color='white' />
						</div>
					) : (
						<div className='flex flex-wrap gap-4'>
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

				<TabsContent value='password'>
					{loading ? (
						<div className='flex justify-center items-center min-h-[200px]'>
							<Loader2 className='animate-spin' size={62} color='white' />
						</div>
					) : (
						<div className='flex flex-wrap gap-4'>
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
			</Tabs>
		</div>
	)
}

export default ResultsTabs
