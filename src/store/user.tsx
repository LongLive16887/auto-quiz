import api from '@/api/axios'
import Cookies from 'js-cookie'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'


type UserStore = {
	user: {
		username?: string
		full_name?: string
	}
	token: string
	setUser: (val: any) => void
	lougoutUser: () => void
	authUser: (loginData: {
		username: string
		password: string
	}) => Promise<void>
}

export const useUserStore = create<UserStore>()(
	persist(
		set => ({
			token: Cookies.get('token') || '',
			user: {},
			setToken: (val: string) => {
				Cookies.set('token', val, { expires: 1, path: '/' })
				set({ token: val })
			},
			setUser: val => {
				set({ user: val })
			},
			authUser: async loginData => {
				try {
					const res = await api.post('/api/v1/auth/login', loginData)
					const token = res.data.data.access_token
					Cookies.set('token', token, { expires: 1, path: '/' })
					set({ token, user: res.data.data.user })
				} catch (error) {
					throw error
				}
			},
			lougoutUser: () => {
				Cookies.set('token', '', { expires: 1, path: '/' })
				set({ token: '', user: {} })
			},
		}),
		{
			name: 'User',
			partialize: state => ({
				user: state.user,
			}),
		}
	)
)
