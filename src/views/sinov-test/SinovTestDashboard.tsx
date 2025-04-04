import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useQuizStore } from '@/store/quiz'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'

const SinovTestDashboard = () => {
	const [open, setOpen] = useState(false)
	const [selectedValue, setSelectedValue] = useState('')
	const { t } = useTranslation()
	const { loadTestQuiz } = useQuizStore()
	const navigate = useNavigate()

	const handleStartTest = () => {
		setOpen(false)
		loadTestQuiz(selectedValue)
		navigate(`/template/${selectedValue}`)
	}

	const handleButtonClick = (value: string) => {
		if (value === selectedValue) {
			setOpen(true)
		} else {
			setSelectedValue(value)
			setOpen(true)
		}
	}

	return (
		<MainLayout>
			<div className='space-x-4'>
				<div className='flex items-center justify-center gap-3.5'>
					<div
						onClick={() => handleButtonClick('20')}
						className='max-w-[350px] flex w-full text-2xl justify-center items-center  py-10 bg-white/30 backdrop-blur-md text-white cursor-pointer rounded-lg border hover:shadow-sm transition'
					>
						20 
					</div>
					<div
						onClick={() => handleButtonClick('50')}
						className='max-w-[350px] w-full flex text-2xl py-10 justify-center items-center bg-white/30 backdrop-blur-md text-white cursor-pointer rounded-lg border hover:shadow-sm transition'
					>
						50
					</div>
				</div>

				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>{t('start')}</DialogTitle>
						</DialogHeader>
						<DialogFooter>
							<div className='flex items-center gap-2'>
								<Button variant='secondary' onClick={() => setOpen(false)}>
									{t('back')}
								</Button>
								<Button onClick={handleStartTest}>{t('start_test')}</Button>
							</div>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</MainLayout>
	)
}

export default SinovTestDashboard
