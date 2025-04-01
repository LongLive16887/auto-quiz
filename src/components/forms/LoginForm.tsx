import { useUserStore } from '@/store/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, LogIn } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { loginShema } from '../../schemas'
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

const LoginForm = () => {
	const { authUser } = useUserStore()
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)

	const form = useForm<z.infer<typeof loginShema>>({
		resolver: zodResolver(loginShema),
		defaultValues: {
			username: '',
			password: '',
		},
	})

	const onSubmit = (data: z.infer<typeof loginShema>) => {
		setLoading(true)
		authUser(data)
			.then(() => {
				setLoading(false)
				navigate('/')
			})
			.catch(() => {
				setLoading(false)
			})
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6 w-full flex flex-col'
			>
				<FormField
					control={form.control}
					name='username'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Login</FormLabel>
							<FormControl>
								<Input {...field} />
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
								<Input type='password' {...field} />
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
					Kirish
					{loading ? <Loader2 className='animate-spin' /> : <LogIn />}
				</Button>
			</form>
		</Form>
	)
}

export default LoginForm
