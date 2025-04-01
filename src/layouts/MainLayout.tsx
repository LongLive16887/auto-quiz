import { ReactNode } from 'react'
import { SidebarProvider } from '../components/ui/sidebar'
import AppSidebar from '../components/AppSidebar'
import AppNav from '../components/AppNav'

type MainLayoutProps = {
	children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<div className='p-3.5 w-full flex flex-col justify-between'>
				<div className='flex flex-col gap-3.5'>
					<AppNav />

					{children}
				</div>
			</div>
		</SidebarProvider>
	)
}

export default MainLayout
