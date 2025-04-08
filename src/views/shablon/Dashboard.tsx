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
				{!allStatsAreZero && (
					<Button className='self-end' size={'sm'} onClick={handleCleanStats}>
					{t('clean_stats')}
						<Eraser />
					</Button>
				)}
				<div className='flex justify-center flex-wrap gap-3.5'>
					{statistics.map((item, index) => (
						<TestBlock data={item} key={index} />
					))}
				</div>
			</div>
		</MainLayout>
	)
}

export default Dashboard
