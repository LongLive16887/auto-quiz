import { useQuizStore } from '@/store/quiz'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { TestBlock } from '../../components/TestBlock'
import MainLayout from '../../layouts/MainLayout'

const Dashboard = () => {
	const { generalStatistics, setGeneralStatistics } = useQuizStore()

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
			<div className='flex justify-center flex-wrap gap-3.5'>
				{generalStatistics.map((item, index) => (
					<TestBlock data={item} key={index} />
				))}
			</div>
			<div>

			</div>
		</MainLayout>
	)
}

export default Dashboard
