import api from '@/api/axios'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TestBlock } from '../../components/TestBlock'
import MainLayout from '../../layouts/MainLayout'

const Dashboard = () => {
	const [testQuantity, setTestQuantity] = useState(0)

	useEffect(() => {
		api.get('/api/groups/maxId').then(res => {
			setTestQuantity(res.data.data.max_group_iD)
		})
	}, [])

	if (!testQuantity) {
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
				{[...Array(testQuantity)].map((_, index) => (
					<TestBlock id={index + 1} key={index} />
				))}
			</div>
		</MainLayout>
	)
}

export default Dashboard
