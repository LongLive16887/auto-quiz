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

export function FanTestBlock({
	id,
	name_uz,
	name_la,
	name_ru,
}: {
	id: number
	name_uz: string
	name_la: string
	name_ru: string
}) {
	const [open, setOpen] = useState(false)
	const navigate = useNavigate()
	const { loadFanQuiz } = useQuizStore()
	const { t, i18n } = useTranslation()

	const getLanguageName = () => {
		switch (i18n.language) {
			case 'uz':
				return name_uz
			case 'la':
				return name_la
			case 'ru':
				return name_ru
			default:
				return name_uz
		}
	}

	const handleStartTest = () => {
		setOpen(false)
		loadFanQuiz(id)
		navigate(`/template/${id}?type=theme`)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<div className='flex flex-col justify-center items-center p-2 bg-white cursor-pointer gap-4 max-w-[380px] min-h-[300px] w-full border rounded-lg hover:shadow-sm transition'>
					<p
						className='text-center'
						dangerouslySetInnerHTML={{ __html: getLanguageName() }}
					></p>
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
						<Button onClick={handleStartTest}>{t('start_test')}</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
