import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useStudentStore } from '@/store/student'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Loader2, LogIn } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { studentSchema } from '../../schemas'
import { Button } from '../ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'

type StudentFormProps = {
	onStudentCreated: () => void
}

const StudentForm = ({ onStudentCreated }: StudentFormProps) => {
	const [loading, setLoading] = useState(false)
	const { createStudent } = useStudentStore()

	const form = useForm<z.infer<typeof studentSchema>>({
		resolver: zodResolver(studentSchema),
		defaultValues: {
			username: '',
			full_name: '',
			password: '',
			confirm_password: '',
			expiration_date: '',
		},
	})

	const onSubmit = (data: z.infer<typeof studentSchema>) => {
		setLoading(true)
		const formattedDate = format(new Date(data.expiration_date), 'yyyy-MM-dd')
		const updatedData = { ...data, expiration_date: formattedDate }
		createStudent(updatedData).then(() => {
			setLoading(false)
			onStudentCreated()
		})
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6 w-full flex flex-col'
				autoComplete='off'
			>
				<FormField
					control={form.control}
					name='username'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Login</FormLabel>
							<FormControl>
								<Input {...field} autoComplete='off' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='full_name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>To'liq ism</FormLabel>
							<FormControl>
								<Input {...field} autoComplete='off' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Parol</FormLabel>
							<FormControl>
								<Input type='password' {...field} autoComplete='new-password' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
				
					control={form.control}
					name='confirm_password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Parol tasdiqlash</FormLabel>
							<FormControl>
								<Input type='password' {...field} autoComplete='new-password' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='expiration_date'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Muddati</FormLabel>
							<FormControl>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={'outline'}
											className={cn(
												'w-[280px] justify-start text-left font-normal',
												!field.value && 'text-muted-foreground'
											)}
										>

											<CalendarIcon className='mr-2 h-4 w-4' />
											{field.value
												? format(new Date(field.value), 'PPP')
												: 'Sanani tanlang'}
										</Button>
									</PopoverTrigger>
									<PopoverContent className='w-auto p-0'>
										<Calendar
											mode='single'
											selected={field.value ? new Date(field.value) : undefined}
											onSelect={selectedDate => {
												field.onChange(selectedDate?.toISOString() || '')
											}}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					className='self-end'
					size='default'
					disabled={loading}
				>
					Saqlash
					{loading ? (
						<Loader2 color='white' className='animate-spin' />
					) : (
						<LogIn />
					)}
				</Button>
			</form>
		</Form>
	)
}

export default StudentForm
