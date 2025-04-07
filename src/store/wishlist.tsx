import api from '@/api/axios'
import { Question } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
	wishlist: Question[]
	fetchWishlist: () => Promise<void>
	addToWishlist: (question: Question) => Promise<void>
	removeFromWishlist: (questionId: number) => Promise<void>
	toggleWishlist: (question: Question) => Promise<void>
}

export const useWishlistStore = create<WishlistState>()(
	persist(
		(set, get) => ({
			wishlist: [],
			fetchWishlist: async () => {
				try {
					const response = await api.get('/api/v1/wishlist')
					set({
						wishlist: response.data.data,
					})
				} catch (error) {
					console.error('Ошибка получения wishlist:', error)
				}
			},
			addToWishlist: async (question: Question) => {
				try {
					await api.post(`/api/v1/wishlist?questionId=${question.id}`)
					set(state => ({ wishlist: [...state.wishlist, question] }))
				} catch (error) {
					console.error('Ошибка добавления в wishlist:', error)
				}
			},
			removeFromWishlist: async (questionId: number) => {
				try {
					await api.delete(`/api/v1/wishlist?questionId=${questionId}`)
					set(state => ({
						wishlist: state.wishlist.filter(q => q.id !== questionId),
					}))
				} catch (error) {
					console.error('Ошибка удаления из wishlist:', error)
				}
			},
			toggleWishlist: async (question: Question) => {
				const { wishlist, addToWishlist, removeFromWishlist } = get()
				const isInWishlist = wishlist.some(q => q.id === question.id)
				if (isInWishlist) {
					await removeFromWishlist(question.id)
				} else {
					await addToWishlist(question)
				}
			},
		}),
		{
			name: 'Wishlist',
			partialize: state => ({
				wishlist: state.wishlist,
			}),
		}
	)
)
