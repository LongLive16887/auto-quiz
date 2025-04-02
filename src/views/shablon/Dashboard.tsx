import { useQuizStore } from '@/store/quiz'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { TestBlock } from '../../components/TestBlock'
import MainLayout from '../../layouts/MainLayout'

const Dashboard = () => {
	const { maxQuizCount, setMaxQuizCount } = useQuizStore()

	useEffect(() => {
		setMaxQuizCount()
	}, [])

	if (!maxQuizCount) {
		return (
			<MainLayout>
				<Loader2
					size={70}
					className='animate-spin h-[calc(100vh-150px)] mx-auto'
				/>
			</MainLayout>
		)
	}

	return (
		<MainLayout>
			<div className='flex justify-center flex-wrap gap-3.5'>
				{[...Array(maxQuizCount)].map((_, index) => (
					<TestBlock id={index + 1} key={index} />
				))}
			</div>
		</MainLayout>
	)
}

export default Dashboard
