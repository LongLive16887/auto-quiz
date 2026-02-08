import { Button } from '@/components/ui/button'
import MainLayout from '@/layouts/MainLayout'
import { useQuizStore } from '@/store/quiz'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import Confetti from 'react-confetti'

export const ResultsPage = () => {
	const navigate = useNavigate()
	const { reset } = useQuizStore()
	const { t } = useTranslation()
	const location = useLocation()

	const { data, type } = location.state || {}
	const isTest = type === 'test'

	const total = data?.correct_answer +
		data?.wrong_answer +
		data?.skipped_answer

	const isWinner = useMemo(() => {
		if (!isTest) return false
		if (total === 20 && data.correct_answer >= 18) return true
		if (total === 50 && data.correct_answer >= 47) return true
		return false
	}, [type, total, data])

	function handleClick() {
		navigate(-2)
		reset()
	}

	return (
		<MainLayout>
			{isTest && isWinner && (
				<Confetti
					recycle={false}
					numberOfPieces={2000}
					gravity={0.25}
				/>
			)}
			<div className='relative z-10 w-full bg-white/10 backdrop-blur-lg text-white border rounded-lg mx-auto p-4 text-center'>
				{isTest && !isWinner ? (
					<div className="space-y-4 mb-8">
						<h1 className='text-3xl font-bold mb-6 text-red-600 uppercase'>
							{t('exam_failed_title')}&#128532;
						</h1>
						<h2 className='text-3xl font-bold mb-6 text-white'>
							{t('exam_failed_desc')}
						</h2>
					</div>
				) : (
					<div className="space-y-4 mb-8">
						<h1 className='text-3xl font-bold mb-6 text-green-600 uppercase'>
							{t('exam_passed_title')}&#129395;
						</h1>
						<h2 className='text-3xl font-bold mb-6 text-white'>
							{t('exam_passed_desc')}
						</h2>
					</div>
				)}
				{!isTest && (
					<>
						<h1 className='text-3xl font-bold mb-6'>
							{t('test_results')}
						</h1>
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
					</>
				)}
				<Button onClick={handleClick}>
					{t('main_menu')}
				</Button>
			</div>
		</MainLayout>
	)
}
