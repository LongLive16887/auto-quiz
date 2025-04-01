import LoginForm from '../../components/forms/LoginForm'

const Login = () => {
	return (
		<div className='w-full min-h-dvh p-4 flex items-center justify-center'>
			<div className='max-w-xl w-full flex flex-col justify-center items-center rounded-xl'>
				<img className='w-48 h-48' src="/logo.png" alt="" />
				<h1 className='text-4xl mb-5'>Tizimga kirish</h1>
				<LoginForm />
			</div>
		</div>
	)
}

export default Login
