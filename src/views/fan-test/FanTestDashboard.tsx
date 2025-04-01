import api from '@/api/axios'
import { FanTestBlock } from '@/components/FanTestBlock'
import { FanTestData } from '@/types'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import MainLayout from '../../layouts/MainLayout'

const FanTestDashboard = () => {
	const [fanTestData, setFanTestData] = useState<FanTestData[]>([])

	useEffect(() => {
		api.get('/api/groups?type_id=100').then(res => {
			setFanTestData(res.data.data)
		})
	}, [])

	if (!fanTestData.length) {
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
				{fanTestData.map(test => (
					<FanTestBlock
						key={test.id}
						id={test.id}
						name_uz={test.name_uz}
						name_la={test.name_la}
						name_ru={test.name_ru}
					/>
				))}
			</div>
		</MainLayout>
	)
}

export default FanTestDashboard
