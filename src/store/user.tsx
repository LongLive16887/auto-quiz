import api from '@/api/axios'
import Cookies from 'js-cookie'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UAParser } from 'ua-parser-js';
import { useWishlistStore } from './wishlist';

type UserStore = {
	user: {
		username?: string
		full_name?: string
	}
	userRoles: string[]
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
			userRoles: [],
			setToken: (val: string) => {
				Cookies.set('token', val, { expires: 1, path: '/' })
				set({ token: val })
			},
			setUser: val => {
				set({ user: val })
			},
			authUser: async loginData => {
				const parser = new UAParser();
				const result = parser.getResult();
				try {
					const res = await api.post('/api/v1/auth/login', loginData,{
						headers: {
							'device-id': screen.width+screen.height+"-"+result.os.name,
						},
					})
					const token = res.data.data.access_token
					Cookies.set('token', token, { expires: 1, path: '/' })
					set({ token, user: res.data.data.user })
					set({userRoles: res.data.data.roles})
				} catch (error) {
					throw error
				}
			},
			lougoutUser: () => {
				useWishlistStore.getState().reset()
				Cookies.set('token', '', { expires: 1, path: '/' })
				set({ token: '', user: {} })
			},
		}),
		{
			name: 'User',
			partialize: state => ({
				user: state.user,
				userRoles: state.userRoles
			}),
		}
	)
)
