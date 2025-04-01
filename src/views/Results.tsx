import { Button } from '@/components/ui/button'
import MainLayout from '@/layouts/MainLayout'
import { useQuizStore } from '@/store/quiz'
import { useLocation, useNavigate } from 'react-router-dom'

export const ResultsPage = () => {
	const navigate = useNavigate()
  const {reset} = useQuizStore()
	const location = useLocation()
	const {
		correctCount = 0,
		incorrectCount = 0,
		total = 0,
	} = location.state || {}

  function handleClick() {
    navigate('/')
    reset()
  }

	return (
		<MainLayout>
			<div className='w-full bg-white rounded-lg mx-auto p-4 text-center'>
				<h1 className='text-3xl font-bold mb-6'>Test natijalari</h1>
				<div className='space-y-4 mb-8'>
					<p className='text-green-600'>To'g'ri javoblar: {correctCount}</p>
					<p className='text-red-600'>Noto'g'ri javoblar: {incorrectCount}</p>
					<p className='text-gray-600'>Jami savollar: {total}</p>
					<p className='text-blue-600 font-bold'>
						Foiz: {((correctCount / total) * 100 || 0).toFixed(1)}%
					</p>
				</div>
				<Button onClick={handleClick}>Asosiy menyu</Button>
			</div>
		</MainLayout>
	)
}
