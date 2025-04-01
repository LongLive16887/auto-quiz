import { useQuizStore } from '@/store/quiz'
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

export function FanTestBlock({
	id,
	name_uz,
}: {
	id: number
	name_uz: string
	name_la: string
	name_ru: string
}) {
	const [open, setOpen] = useState(false)
	const navigate = useNavigate()
	const { loadFanQuiz } = useQuizStore()

	const handleStartTest = () => {
		setOpen(false)
		loadFanQuiz(id)
		navigate(`/template/${id}`)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<div className='flex flex-col justify-center items-center p-2 bg-white cursor-pointer gap-4 max-w-[380px] min-h-[300px] w-full border rounded-lg hover:shadow-sm transition'>
					<p
						className='text-center'
						dangerouslySetInnerHTML={{ __html: name_uz }}
					></p>
					{/* <p
						className='text-center'
						dangerouslySetInnerHTML={{ __html: name_la }}
					></p>
					<p
						className='text-center'
						dangerouslySetInnerHTML={{ __html: name_ru }}
					></p> */}
				</div>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Тестни бошлаш</DialogTitle>
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
