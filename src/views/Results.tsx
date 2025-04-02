import { Button } from '@/components/ui/button'
import MainLayout from '@/layouts/MainLayout'
import { useQuizStore } from '@/store/quiz'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

export const ResultsPage = () => {
	const navigate = useNavigate()
	const { reset } = useQuizStore()
	const { t } = useTranslation()
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
				<h1 className='text-3xl font-bold mb-6'>{t('test_results')}</h1>
				<div className='space-y-4 mb-8'>
					<p className='text-green-600'>
						{t('right_answers')}: {correctCount}
					</p>
					<p className='text-red-600'>
						{t('incorrect_answers')}: {incorrectCount}
					</p>
					<p className='text-gray-600'>
						{t('all_questions')}: {total}
					</p>
					<p className='text-blue-600 font-bold'>
						{t('percent')}: {((correctCount / total) * 100 || 0).toFixed(0)}%
					</p>
				</div>
				<Button onClick={handleClick}>{t('main_menu')}</Button>
			</div>
		</MainLayout>
	)
}
