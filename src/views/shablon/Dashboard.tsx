import api from '@/api/axios'
import { Button } from '@/components/ui/button'
import { Eraser, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TestBlock } from '../../components/TestBlock'
import MainLayout from '../../layouts/MainLayout'
import { BlockData } from '@/types'
import { useQuizStore } from '@/store/quiz'
import { useTranslation } from 'react-i18next'

const Dashboard = () => {
	const [statistics, setStatistics] = useState<BlockData[]>([])
	const {setMaxQuizCount} = useQuizStore()
	const { t } = useTranslation()
	const handleCleanStats = () => {
		api.delete('/api/v1/user/statistics/delete-by-type/102').then(() => {
			getStats()
		})
	}
	const allStatsAreZero = statistics.every(
		stat =>
			stat.wrong_answer === 0 &&
			stat.correct_answer === 0 &&
			stat.skipped_answer === 0
	)

	const getStats = () => {
		api.get('/api/v1/user/statistics?type=102').then(res => {
			setStatistics(res.data.data)
			setMaxQuizCount(res.data.data.length)
		})
	}

	useEffect(() => {
		getStats()
	}, [])

	if (!statistics.length) {
		return (
			<MainLayout>
				<Loader2
					color='white'
					size={70}
					className='animate-spin h-[calc(100vh-150px)] mx-auto'
				/>
			</MainLayout>
		)
	}

	return (
		<MainLayout>
			<div className='flex flex-col gap-3.5'>
				<div className='grid gap-3.5 justify-center [grid-template-columns:repeat(auto-fill,150px)]'>
					<div className='col-span-full bg-yellow-400/15 border border-yellow-400/40 rounded-lg px-4 py-2.5 text-yellow-300 text-sm'>
						<span className='font-bold text-yellow-200'>Ogohlantirish❗️</span>{' '}
						Express kursga har kuni darsga kelish kerak. 5 kundan ko'p sababsiz dars qoldirgan o'quvchilar o'qishdan haydaladi, o'qishni davom etirish uchun qayta to'lov qilishga to'g'ri keladi! Avtoshkolada o'qish mudati 2,5 oy, o'qish tugagandan so'ng avtomatik tarzda login parol o'chib ketadi qayta ochib berilmaydi, o'qish davomida kelib tayyorlanish shart!
					</div>
					{!allStatsAreZero && (
						<div className='col-span-full flex justify-end'>
							<Button size={'sm'} onClick={handleCleanStats}>
								{t('clean_stats')}
								<Eraser />
							</Button>
						</div>
					)}
					{statistics.map((item, index) => (
						<TestBlock data={item} key={index} />
					))}
				</div>
			</div>
		</MainLayout>
	)
}

export default Dashboard
