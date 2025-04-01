import { LogOutIcon } from 'lucide-react'
import { Button } from './ui/button'
import { SidebarTrigger } from './ui/sidebar'
import { useUserStore } from '@/store/user'

const AppNav = () => {
	const {lougoutUser} = useUserStore()
	return (
		<div className='flex items-center justify-between p-3.5 bg-white rounded-lg'>
			<div className='flex items-center gap-2'>
				<SidebarTrigger />
			</div>
			<Button onClick={lougoutUser}>
				<LogOutIcon />
			</Button>
		</div>
	)
}

export default AppNav
