import { FanTestBlock } from '@/components/FanTestBlock'
import { useQuizStore } from '@/store/quiz'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import MainLayout from '../../layouts/MainLayout'

const FanTestDashboard = () => {
	const { statistics, setStatistics } = useQuizStore()

	useEffect(() => {
		setStatistics(true)
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
			<div className='flex justify-center flex-wrap gap-3.5'>
				{statistics.map(test => (
					<FanTestBlock key={test.id} data={test} />
				))}
			</div>
		</MainLayout>
	)
}

export default FanTestDashboard
