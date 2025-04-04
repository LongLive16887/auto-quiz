import LoginForm from '../../components/forms/LoginForm'

const Login = () => {
	return (
		<div className='w-full min-h-dvh p-4  flex items-center justify-center'>
			<div className='max-w-xl w-full flex border bg-white/30 backdrop-blur-md rounded-lg flex-col justify-center items-center px-10 py-4'>
				<img className='w-48 h-48 bg-white rounded-full mb-2' src="/logo.png" alt="" />
				<h1 className='text-4xl mb-5 text-white'>Tizimga kirish</h1>
				<LoginForm />
			</div>
		</div>
	)
}

export default Login
