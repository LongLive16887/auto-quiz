import { Navigate, Outlet } from 'react-router-dom'
import { useUserStore } from '../store/user'

export const AuthMiddleware = () => {
	const { token } = useUserStore()
	return token ? <Outlet /> : <Navigate to='/login' />
}

export const GuestMiddleware = () => {
	const { token } = useUserStore()
	return token ? <Navigate to='/' /> : <Outlet />
}
