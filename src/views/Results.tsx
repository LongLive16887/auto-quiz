import { Button } from '@/components/ui/button'
import MainLayout from '@/layouts/MainLayout'
import { useQuizStore } from '@/store/quiz'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

export const ResultsPage = () => {
	const navigate = useNavigate()
	const { reset } = useQuizStore()
	const { t } = useTranslation()
	const location = useLocation()

	// Получаем данные из состояния
	const { data } = location.state || {}

	useEffect(() => {}, [])

	function handleClick() {
		navigate(-2)
		reset()
	}

	return (
		<MainLayout>
			<div className='w-full bg-white/30 backdrop-blur-md text-white border rounded-lg mx-auto p-4 text-center'>
				<h1 className='text-3xl font-bold mb-6'>{t('test_results')}</h1>
				<div className='space-y-4 mb-8'>
					<p className='text-green-600'>
						{t('right_answers')}: {data.correct_answer}
					</p>
					<p className='text-red-600'>
						{t('incorrect_answers')}: {data.wrong_answer}
					</p>
					<p className='text-white'>
						{t('skipped_questions')}: {data.skipped_answer}
					</p>
				</div>
				<Button onClick={handleClick}>{t('main_menu')}</Button>
			</div>
		</MainLayout>
	)
}
