import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthMiddleware, GuestMiddleware } from './middleware/authMiddleware'
import Login from './views/auth/Login'
import FanTestDashboard from './views/fan-test/FanTestDashboard'
import { ResultsPage } from './views/Results'
import Dashboard from './views/shablon/Dashboard'
import TemplateTest from './views/shablon/TemplateTest'
import SinovTestDashboard from './views/sinov-test/SinovTestDashboard'



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
				path: '/results',
				element: <ResultsPage />,
			},
		],
	},
])

function App() {
	return (
		<RouterProvider router={router} />
	)
}

export default App
