import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useUserStore } from '@/store/user'
import { LogOutIcon, ReceiptText, Split } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from './ui/button'
import { SidebarTrigger } from './ui/sidebar'
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from './ui/dialog'
import { useState } from 'react'
import { PdfModal } from './PdfModal'
import { OctagonMinus } from 'lucide-react'

const AppNav = () => {
	const { lougoutUser } = useUserStore()
	const { i18n, t } = useTranslation()
	const [open, setOpen] = useState(false)
	const [openFirstPdf, setOpenFirstPdf] = useState(false)
	const [openSecondPdf, setSecondFirstPdf] = useState(false)
	const [openThirdPdf, setThirdFirstPdf] = useState(false)

	const languages = [
		{ code: 'ru', label: 'Русский' },
		{ code: 'uz', label: "O'zbek" },
		{ code: 'la', label: 'Latin' },
	]

	return (
		<div className='flex items-center justify-between p-3.5 border bg-white/10 backdrop-blur-lg rounded-lg'>
			<div className='flex items-center gap-3'>
				<SidebarTrigger />
			</div>
			<div className='flex items-center gap-3.5'>
				{/* 
				<div className='flex gap-2 items-center'>
					<a
						className='cursor-pointer'
						href='https://www.instagram.com/avtotest_begzod/'
						target='_blank'
					>
						<img className='w-8 h-8' src='/instagram.svg' alt='' />
					</a>
					<a
						className='cursor-pointer'
						href='https://t.me/avtotest_begzod'
						target='_blank'
					>
						<img className='w-8 h-8' src='/telegram.svg' alt='' />
					</a>
				</div> */}
				<PdfModal open={openFirstPdf} onClose={setOpenFirstPdf} pdfUrl='/pdf/way_signs.pdf' icon={OctagonMinus} />
				<PdfModal open={openSecondPdf} onClose={setSecondFirstPdf} pdfUrl='/pdf/way_lines.pdf' icon={Split} />
				<PdfModal open={openThirdPdf} onClose={setThirdFirstPdf} pdfUrl='/pdf/way_terms.pdf' icon={ReceiptText} />
				<Select
					value={i18n.language}
					onValueChange={value => {
						i18n.changeLanguage(value)
					}}
				>
					<SelectTrigger className='w-[110px]'>
						<SelectValue placeholder={t('select_language')} />
					</SelectTrigger>
					<SelectContent>
						{languages.map(lang => (
							<SelectItem key={lang.code} value={lang.code}>
								<p className='text-sm'>{lang.label}</p>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button className='gap-2'>
							<LogOutIcon className='w-4 h-4' />
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Tasdiqlash</DialogTitle>
						</DialogHeader>
						<p>Akauntdan chiqmoqchimisiz?</p>
						<DialogFooter className='gap-2'>
							<Button
								variant='outline'
								onClick={() => setOpen(false)}
							>
								Yoq
							</Button>
							<Button
								onClick={() => {
									lougoutUser()
									setOpen(false)
								}}
							>
								Ha
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	)
}

export default AppNav
