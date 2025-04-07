import api from '@/api/axios'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type StudentStore = {
	student: {
		username?: string
		full_name?: string
		password?: string
		confirm_password?: string
		expiration_date?: string
	}
	setStudent: (val: any) => void
	createStudent: (data: {
		username: string
		full_name: string
		password: string
		confirm_password: string
		expiration_date: string
	}) => Promise<void>
	changeStudentPassword: (data: {
		username: string
		password: string
		confirm_password: string
	}) => Promise<void>
}

export const useStudentStore = create<StudentStore>()(
	persist(
		set => ({
			student: {},
			setStudent: val => {
				set({ student: val })
			},
			createStudent: async data => {
				try {
					await api.post('/api/v1/auth/registration', data)
				} catch (error) {
					throw error
				}
			},
			changeStudentPassword: async data => {
				try {
					await api.post('/api/v1/auth/change_password', data)
				} catch (error) {
					throw error
				}
			},
		}),
		{
			name: 'Student',
			partialize: () => ({}),
		}
	)
)
