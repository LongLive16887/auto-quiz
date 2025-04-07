import api from '@/api/axios'
import { Button } from '@/components/ui/button'
import { useQuizStore } from '@/store/quiz'
import { Eraser, Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { TestBlock } from '../../components/TestBlock'
import MainLayout from '../../layouts/MainLayout'

const Dashboard = () => {
	const { generalStatistics, setGeneralStatistics } = useQuizStore()

	const handleCleanStats = () => {
		api.delete('/api/v1/user/statistics/delete-by-type/102').then(() => {
			setGeneralStatistics()
		})
	}
	const allStatsAreZero = generalStatistics.every(
		stat =>
			stat.wrong_answer === 0 &&
			stat.correct_answer === 0 &&
			stat.skipped_answer === 0
	)

	useEffect(() => {
		setGeneralStatistics()
	}, [])

	if (!generalStatistics.length) {
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
					{generalStatistics.map((item, index) => (
						<TestBlock data={item} key={index} />
					))}
				</div>
			</div>
		</MainLayout>
	)
}

export default Dashboard
