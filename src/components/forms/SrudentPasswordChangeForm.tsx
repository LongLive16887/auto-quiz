import { useStudentStore } from '@/store/student'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, LogIn } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { studentPasswordSchema } from '../../schemas'
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
	onPasswordChange: () => void
	username: string
}

const StudentPasswordChangeForm = ({
	onPasswordChange,
	username,
}: StudentFormProps) => {
	const [loading, setLoading] = useState(false)
	const {changeStudentPassword } = useStudentStore()

	const form = useForm<z.infer<typeof studentPasswordSchema>>({
		resolver: zodResolver(studentPasswordSchema),
		defaultValues: {
			username: username,
			password: '',
			confirm_password: '',
		},
	})

	const onSubmit = (data: z.infer<typeof studentPasswordSchema>) => {
		setLoading(true)
		changeStudentPassword(data).then(() => {
			setLoading(false)
			onPasswordChange()
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
					disabled
					render={({ field }) => (
						<FormItem>
							<FormLabel>Parol</FormLabel>
							<FormControl>
								<Input  {...field} />
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

export default StudentPasswordChangeForm
