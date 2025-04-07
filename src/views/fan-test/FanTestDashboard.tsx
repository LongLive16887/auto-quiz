import api from '@/api/axios'
import { FanTestBlock } from '@/components/FanTestBlock'
import { Button } from '@/components/ui/button'
import { useQuizStore } from '@/store/quiz'
import { Eraser, Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import MainLayout from '../../layouts/MainLayout'

const FanTestDashboard = () => {
	const { fanStatistics, setFanStatistics } = useQuizStore()

	const handleCleanStats = () => {
		api.delete('/api/v1/user/statistics/delete-by-type/100').then(() => {
			setFanStatistics()
		})
	}
	const allStatsAreZero = fanStatistics.every(
		stat =>
			stat.wrong_answer === 0 &&
			stat.correct_answer === 0 &&
			stat.skipped_answer === 0
	)

	useEffect(() => {
		setFanStatistics()
	}, [])

	if (!fanStatistics.length) {
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
					<Button className='self-end' onClick={handleCleanStats}>
						Statistikani tozalash
						<Eraser />
					</Button>
				)}
				<div className='flex justify-center flex-wrap gap-3.5'>
					{fanStatistics.map(test => (
						<FanTestBlock key={test.id} data={test} />
					))}
				</div>
			</div>
		</MainLayout>
	)
}

export default FanTestDashboard
