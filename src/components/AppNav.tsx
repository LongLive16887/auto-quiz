import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useUserStore } from '@/store/user'
import { LogOutIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from './ui/button'
import { SidebarTrigger } from './ui/sidebar'

const AppNav = () => {
	const { lougoutUser } = useUserStore()
	const { i18n } = useTranslation()
	const languages = [
		{ code: 'ru', label: 'Русский' },
		{ code: 'uz', label: "O'zbek" },
		{ code: 'la', label: 'Latin' },
	]

	return (
		<div className='flex items-center justify-between p-3.5 border bg-white/10 backdrop-blur-lg rounded-lg'>
			<div className='flex items-center gap-3'>
				<SidebarTrigger />
			</div>
			<div className='flex items-center gap-3.5'>
				<div className='flex gap-2 items-center'>
					<a
						className='cursor-pointer'
						href='https://www.instagram.com/avtotest_begzod/'
						target='_blank'
					>
						<img className='w-8 h-8' src='/instagram.svg' alt='' />
					</a>
					<a
						className='cursor-pointer'
						href='https://t.me/avtotest_begzod'
						target='_blank'
					>
						<img className='w-8 h-8' src='/telegram.svg' alt='' />
					</a>
				</div>
				<Select
					value={i18n.language}
					onValueChange={value => {
						i18n.changeLanguage(value)
					}}
				>
					<SelectTrigger className='w-[110px]'>
						<SelectValue placeholder='Выбери язык' />
					</SelectTrigger>
					<SelectContent>
						{languages.map(lang => (
							<SelectItem key={lang.code} value={lang.code}>
								<p className='text-sm'> {lang.label}</p>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Button onClick={lougoutUser}>
					<LogOutIcon />
				</Button>
			</div>
		</div>
	)
}

export default AppNav
