import { useQuizStore } from '@/store/quiz'
import { useUserStore } from '@/store/user'
import { Lightbulb, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from './ui/sidebar'
import { Link } from 'react-router-dom'

const AppSidebar = () => {
	const { maxQuizCount } = useQuizStore()
	const { t } = useTranslation()
	const { user } = useUserStore()
	const items = [
		{
			title: `${t('shablon_test')} (${maxQuizCount})`,
			url: '/',
			icon: Lightbulb,
		},
		{ title: `${t('sinov_test')} (20/50)`, url: '/test', icon: Lightbulb },
		{ title: t('theme_test'), url: '/fan-test', icon: Lightbulb },
	]

	return (
		<Sidebar variant='floating'>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<div className='flex flex-col items-center gap-2 justify-center'>
							<div className='w-[80px] h-[80px] flex items-center justify-center bg-primary rounded-full'>
								<User color='white' size={40} />
							</div>
							<div className='flex flex-col justify-center items-center mb-3'>
								<p className='text-lg text-center font-semibold text-white'>
									{user.full_name}
								</p>
							</div>
						</div>
						<hr />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										isActive={
											item.url === '/'
												? location.pathname === '/'
												: location.pathname.startsWith(item.url)
										}
										asChild
									>
										<Link to={item.url} className='font-semibold text-lg text-white'>
											<item.icon size={30} />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<div className='flex justify-center'>
							<img
								className='w-40 h-40 object-cover rounded-full bg-white'
								src='/logo.png'
								alt=''
							/>
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}

export default AppSidebar
