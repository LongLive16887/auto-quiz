import { useQuizStore } from '@/store/quiz'
import { BlockData } from '@/types'
import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog'

export function FanTestBlock({ data }: { data: BlockData }) {
	const [open, setOpen] = useState(false)
	const navigate = useNavigate()
	const { loadFanQuiz } = useQuizStore()
	const { t, i18n } = useTranslation()

	const getLanguageName = () => {
		switch (i18n.language) {
			case 'uz':
				return data.name_uz
			case 'la':
				return data.name_la
			case 'ru':
				return data.name_ru
			default:
				return data.name_uz
		}
	}

	const handleStartTest = () => {
		setOpen(false)
		loadFanQuiz(data.id)
		navigate(`/template/${data.id}?type=theme`)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<div className='flex relative flex-col justify-center items-center p-2 bg-white/30 backdrop-blur-md text-white cursor-pointer gap-4 max-w-[370px] min-h-[300px] w-full border rounded-lg hover:shadow-sm transition'>
					<p
						className='text-center'
						dangerouslySetInnerHTML={{ __html: getLanguageName() }}
					></p>
					{data.correct_answer !== 0 && data.wrong_answer !== 0 ? (
						<div className='flex items-center gap-1 absolute top-1 right-1'>
							<Badge variant='succes'>
								<Check size={15} /> {data.wrong_answer}
							</Badge>

							<Badge variant='error'>
								<X size={15} /> {data.wrong_answer}
							</Badge>
						</div>
					) : null}
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
