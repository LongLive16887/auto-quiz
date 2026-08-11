import LoginForm from '../../components/forms/LoginForm'
const Login = () => {
	return (
		<div className='w-full min-h-dvh p-4  flex items-center justify-center'>
			<div className='max-w-xl w-full flex border bg-white/30 backdrop-blur-md rounded-lg flex-col justify-center items-center px-10 py-4'>
				<img className='w-48 h-48 bg-white rounded-full mb-2' src="/logo.png" alt="" />
				<h1 className='text-4xl mb-5 text-white'>Tizimga kirish</h1>
				<div className='flex flex-col gap-1 items-center mb-5'>
					<p className='text-white max-md:text-sms'>Murojaat uchun:</p>
					<a href='tel:+998970098811' className='text-white flex items-center gap-2 max-md:text-xs'>Shaxzod: +998 97 009 88 11</a>
					<a href='tel:+998975852404' className='text-white flex items-center gap-2 max-md:text-xs'>Begzod: +998 97 585 24 04</a>
			    </div>
				<LoginForm />
			</div>
		</div>
	)
}

export default Login
