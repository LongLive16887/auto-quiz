import { useQuizStore } from '@/store/quiz'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog'

export function TestBlock({ id }: { id: number }) {
	const [open, setOpen] = useState(false)
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { loadQuiz } = useQuizStore()

	const handleStartTest = () => {
		setOpen(false)
		loadQuiz(id)
		navigate(`/template/${id}`)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<div className='flex flex-col items-center py-10 bg-white cursor-pointer gap-2 max-w-[160px] w-full rounded-lg border hover:shadow-sm transition'>
					<p className='text-lg'>
						{id} - {t('bilet')}
					</p>
				</div>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>{t('start')}</DialogTitle>
				</DialogHeader>
				<DialogFooter>
					<div className='flex items-center gap-2'>
						<Button variant='secondary' onClick={() => setOpen(false)}>
							{t('back')}
						</Button>
						<Button onClick={handleStartTest}> {t('start_test')}</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
