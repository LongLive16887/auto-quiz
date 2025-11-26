import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import MainLayout from '@/layouts/MainLayout'
import { useWishlistStore } from '@/store/wishlist'
import { Question } from '@/types'
import { Bookmark } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Switch } from '@/components/ui/switch'
import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '@/store/quiz'
import { WishlistTestBlock } from '@/components/WishlistTestBlock'

export function createBlocks(length: number): {id: number}[] {
	return Array.from({ length }).map((_, index) => ({
		id: index,
	}))
}

const STORAGE_KEY_MODE = 'wishlist-test-mode'
const QUESTIONS_PER_BLOCK = 20

const Wishlist = () => {
	const { fetchWishlist, wishlist, toggleWishlist } = useWishlistStore()
	const { i18n, t } = useTranslation()
	const [testMode, setTestMode] = useState(false)
	const navigate = useNavigate()
	const { setQuiz } = useQuizStore();

	const [blocks, setBlocks] = useState<{id: number}[]>([])

	useEffect(() => {
		fetchWishlist()
	}, [fetchWishlist])

	useEffect(() => {
		const savedMode = localStorage.getItem(STORAGE_KEY_MODE)
		if (savedMode !== null) {
			setTestMode(savedMode === 'true')
		}

		if (wishlist.length) {
			const blockCount = Math.max(1, Math.ceil(wishlist.length / QUESTIONS_PER_BLOCK))
			setBlocks(createBlocks(blockCount))
		}
	}, [wishlist])

	const getTranslationHTML = (
		prefix: 'question' | 'question_description' | 'answer',
		obj: Question
	) => {
		const langKey = `${prefix}_${i18n.language}` as keyof Question
		return { __html: obj[langKey] || '' }
	}

	const handleSetTestMode = () => {
		setTestMode(prev => {
			const newValue = !prev
			localStorage.setItem(STORAGE_KEY_MODE, String(newValue))
			return newValue
		})
	}

	const onStartTest = (blockId: number) => {
		const start = blockId * QUESTIONS_PER_BLOCK
		const end = start + QUESTIONS_PER_BLOCK
		const quizQuestions = wishlist.slice(start, end)

		if (!quizQuestions.length) return

		setQuiz(quizQuestions)
		navigate(`/template/${blockId}?type=wishlist`)
	}

	if (!wishlist.length) {
		return (
			<MainLayout>
				<div>
					<p className='text-white h-[calc(100vh-150px)] mx-auto'>
						Saqlangan yo‘q
					</p>
				</div>
			</MainLayout>
		)
	}

	return (
		<MainLayout>
			<div className='p-4'>
				<div className='flex items-center justify-end gap-2 text-white mb-4'>
					<span>{t('test_mode')}</span>
					<Switch checked={testMode} onCheckedChange={handleSetTestMode} />
				</div>
				{testMode ? (
					<div className="flex justify-center flex-wrap gap-3.5">
						{blocks.map(block => (
							<WishlistTestBlock key={block.id} data={block} onStartTest={onStartTest} />
						))}
					</div>
				) : (
					<div className='flex flex-wrap gap-4 justify-center'>
						{wishlist.map(question => (
							<div
								key={question.id}
								className='relative flex flex-col md:flex-row w-full bg-white/10 backdrop-blur-lg p-4 rounded-lg shadow-md text-white gap-4'
							>
								<Button
									variant='ghost'
									size='icon'
									className='absolute top-2 right-2 text-yellow-400 hover:text-yellow-500 z-10'
									onClick={() => toggleWishlist(question)}
								>
									<Bookmark fill='currentColor' className='w-5 h-5' />
								</Button>

								{/* Левая часть */}
								<div className='w-full md:w-80 flex flex-col'>
									<div
										className='text-sm mb-2'
										dangerouslySetInnerHTML={getTranslationHTML('question', question)}
									/>

									{question.mobile_media ? (
										<Dialog>
											<DialogTrigger asChild>
												<img
													src={`https://backend.avtotest-begzod.uz/api/v1/file/download/${question.mobile_media}`}
													alt='Question'
													className='w-full h-40 object-cover rounded-md mb-2 cursor-pointer'
												/>
											</DialogTrigger>
											<DialogContent className='max-w-4xl p-0 bg-transparent border-none shadow-none'>
												<img
													src={`https://backend.avtotest-begzod.uz/api/v1/file/download/${question.mobile_media}`}
													alt='Full view'
													className='w-full h-auto rounded-lg object-cover max-h-[80vh]'
												/>
											</DialogContent>
										</Dialog>
									) : (
										<div className='h-40 bg-white w-40 mx-auto rounded-full object-contain mb-2'>
											<img className='h-full w-full object-contain' src='/logo.png' alt='Logo' />
										</div>
									)}

									<div className='space-y-1 pt-2 overflow-y-auto pr-2'>
										{question.answers.map((answer, index) => (
											<div
												key={index}
												className={`px-3 py-2 rounded-md text-xs ${
													answer.is_correct ? 'bg-green-600 text-white' : 'bg-white/20 text-white'
												}`}
												dangerouslySetInnerHTML={{
													__html: (answer as any)[`answer_${i18n.language}`] || '',
												}}
											/>
										))}
									</div>
								</div>
								<div className='flex-1 text-sm text-gray-200 p-2 border-t md:border-t-0 md:border-l border-white/20'>
									<p className='text-sm font-semibold mb-2'>
										{i18n.language === 'ru' && 'Описание'}
										{i18n.language === 'uz' && 'Тавсиф'}
										{i18n.language === 'la' && 'Tavsif'}
									</p>
									<div
										className='text-sm leading-relaxed max-h-60 overflow-y-auto'
										dangerouslySetInnerHTML={getTranslationHTML('question_description', question)}
									/>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</MainLayout>
	)
}

export default Wishlist
