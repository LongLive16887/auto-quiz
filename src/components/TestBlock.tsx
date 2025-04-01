import { useState } from 'react'
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
import { useQuizStore } from '@/store/quiz'

export function TestBlock({ id }: { id: number }) {
	const [open, setOpen] = useState(false)
	const navigate = useNavigate()
	const { loadQuiz } = useQuizStore()

	const handleStartTest = () => {
		setOpen(false) 
		loadQuiz(id)
		navigate(`/template/${id}?time=10`) 
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<div className='flex flex-col items-center py-10 bg-white cursor-pointer gap-2 max-w-[160px] w-full rounded-lg border hover:shadow-sm transition'>
					<p className='text-lg'>{id} - Bilet</p>
				</div>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Бошлаш</DialogTitle>
				</DialogHeader>
				<DialogFooter>
					<div className='flex items-center gap-2'>
						<Button variant='secondary' onClick={() => setOpen(false)}>
							Оркага
						</Button>
						<Button onClick={handleStartTest}>Тест бошлаш</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
