import { Badge } from '@/components/ui/badge'
import { useQuizStore } from '@/store/quiz'
import { BlockData } from '@/types'
import { Check, CircleAlert, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import 'react-rater/lib/react-rater.css'
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

export function TestBlock({ data }: { data: BlockData }) {
	const [open, setOpen] = useState(false)
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { loadQuiz } = useQuizStore()

	const handleStartTest = () => {
		setOpen(false)
		loadQuiz(data.id)
		navigate(`/template/${data.id}`)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<div className='flex flex-col relative items-center py-10 bg-white/30 backdrop-blur-md cursor-pointer gap-2 max-w-[150px] w-full rounded-lg border hover:shadow-sm transition'>
					<p className='text-lg text-white'>
						{data.id} - {t('bilet')}
					</p>
					{data.correct_answer !== 0 && data.wrong_answer !== 0 || data.skipped_answer !== 0 ? (
						<div className='flex items-center gap-1 absolute top-1 right-1'>
							<Badge variant='warn'>
								<CircleAlert size={15} /> {data.skipped_answer}
							</Badge>

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
						<Button onClick={handleStartTest}> {t('start_test')}</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
