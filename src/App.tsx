import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthMiddleware, GuestMiddleware } from './middleware/authMiddleware'
import Login from './views/auth/Login'
import FanTestDashboard from './views/fan-test/FanTestDashboard'
import { ResultsPage } from './views/Results'
import Dashboard from './views/shablon/Dashboard'
import TemplateTest from './views/shablon/TemplateTest'
import SinovTestDashboard from './views/sinov-test/SinovTestDashboard'
import Students from './views/Students'
import Wishlist from './views/Wishlist'
import TrickTestDashboard from './views/trick-test/TrickTestDashboard'
import DigitalTestDashboard from './views/digital-test/DigitalTestDashboard'
import { useUserStore } from './store/user'
import { useEffect } from 'react'

const router = createBrowserRouter([
	{
		element: <GuestMiddleware />,
		children: [
			{
				path: '/login',
				element: <Login />,
			},
		],
	},
	{
		element: <AuthMiddleware />,
		children: [
			{
				path: '/',
				element: <Dashboard />,
			},
			{
				path: '/template/:id',
				element: <TemplateTest />,
			},
			{
				path: '/test',
				element: <SinovTestDashboard />,
			},
			{
				path: '/fan-test',
				element: <FanTestDashboard />,
			},
			{
				path: '/trick-test',
				element: <TrickTestDashboard />,
			},
			{
				path: '/digital-test',
				element: <DigitalTestDashboard />,
			},
			{
				path: '/results',
				element: <ResultsPage />,
			},
			{
				path: '/wishlist',
				element: <Wishlist />,
			},
			{
				path: '/students',
				element: <Students />,
			},
		],
	},
])

function App() {
	const { userRoles } = useUserStore()
	useEffect(() => {

		if (!userRoles.includes("WRITE")) {

			const handleContextMenu = (e: MouseEvent) => e.preventDefault();
			document.addEventListener("contextmenu", handleContextMenu);

			const handleCopy = (e: ClipboardEvent) => e.preventDefault();
			document.addEventListener("copy", handleCopy);

			const handleSelect = (e: Event) => e.preventDefault();
			document.addEventListener("selectstart", handleSelect);

			const handleDragStart = (e: DragEvent) => {
				e.preventDefault();
			};
			document.addEventListener("dragstart", handleDragStart);

			const handleKeyDown = (e: KeyboardEvent) => {
				if (
					e.key === "F12" ||
					(e.ctrlKey && e.shiftKey && ["I", "J", "C", "K", "U"].includes(e.key.toUpperCase()))
				) {
					e.preventDefault();
				}
			};
			document.addEventListener("keydown", handleKeyDown);

			return () => {
				document.removeEventListener("contextmenu", handleContextMenu);
				document.removeEventListener("copy", handleCopy);
				document.removeEventListener("selectstart", handleSelect);
				document.removeEventListener("keydown", handleKeyDown);
				document.removeEventListener("dragstart", handleDragStart)
			};
		}
	}, [userRoles]);




	return <RouterProvider router={router} />
}

export default App
