import api from '@/api/axios'
import StudentPasswordChangeForm from '@/components/forms/SrudentPasswordChangeForm'
import StudentEditForm from '@/components/forms/StudentEditForm'
import StudentForm from '@/components/forms/StudentForm'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MainLayout from '@/layouts/MainLayout'
import { Student } from '@/types'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Loader2, Pen, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const Students = () => {
	const [searchTerm, setSearchTerm] = useState('')
	const [data, setData] = useState<Student[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(10)
	const pageSize = 10
	const [showConfirm, setShowConfirm] = useState(false)
	const [showPasswordChange, setShowPasswordChange] = useState(false)
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
	const { t } = useTranslation()
	const getStudents = (username?: string, page = 1) => {
		const query = username ? `&username=${username}` : ''
		api
			.get(`/api/v1/auth?page=${page - 1}&size=${pageSize}${query}`)
			.then(res => {
				setData(res.data.data.results)
				setTotalPages(res.data.data.totalPages)
			})
			.catch(err => {
				console.error('Error fetching data:', err)
			})
	}

	const handlePasswordChange = () => {
		setShowPasswordChange(false)
		getStudents()
	}

	const handlePasswordChangeClick = (student: Student) => {
		setSelectedStudent(student)
		setShowPasswordChange(true)
	}

	useEffect(() => {
		getStudents(searchTerm, currentPage)
	}, [currentPage])

	const handleSearch = () => {
		setCurrentPage(1)
		getStudents(searchTerm, 1)
	}

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page)
		}
	}

	return (
		<MainLayout>
			<div className='flex flex-col h-full'>
				<div className='flex items-baseline justify-between flex-wrap gap-2'>
					<div className='flex items-center gap-1 w-full max-w-[300px]'>
						<Input
							clearable
							className='h-[36px]'
							placeholder='F.I.O'
							value={searchTerm}
							onChange={e => {
								const value = e.target.value
								setSearchTerm(value)
								if (value.trim() === '') {
									getStudents()
								}
							}}
						/>
						<Button onClick={handleSearch}>
							<Search />
						</Button>
					</div>

					<Dialog open={showConfirm} onOpenChange={setShowConfirm}>
						<DialogTrigger asChild>
							<div className='mb-3.5 flex justify-end'>
								<Button>{t('add_student')}</Button>
							</div>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>{t('add_student')}</DialogTitle>
							</DialogHeader>
							<StudentForm onStudentCreated={handlePasswordChange} />
						</DialogContent>
					</Dialog>
				</div>

				<Dialog open={showPasswordChange} onOpenChange={setShowPasswordChange}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{t('edit')}</DialogTitle>
						</DialogHeader>
						<Tabs defaultValue='account'>
							<TabsList className='mb-3.5'>
								<TabsTrigger value='account'>Akaunt</TabsTrigger>
								<TabsTrigger value='password'>Parol</TabsTrigger>
							</TabsList>
							<TabsContent value='account'>
								{selectedStudent && (
									<StudentEditForm
										data={selectedStudent}
										onPasswordChange={handlePasswordChange}
									/>
								)}
							</TabsContent>
							<TabsContent value='password'>
								{' '}
								{selectedStudent && (
									<StudentPasswordChangeForm
										username={selectedStudent.username}
										onPasswordChange={handlePasswordChange}
									/>
								)}
							</TabsContent>
						</Tabs>
					</DialogContent>
				</Dialog>
				{data.length ? (
					<div className='mb-3.5'>
						<Table>
							<TableHeader>
								<TableRow className='text-white'>
									<TableHead className='w-[100px]'>ID</TableHead>
									<TableHead>Login</TableHead>
									<TableHead>F.I.O</TableHead>
									<TableHead>{t('expiration')}</TableHead>
									<TableHead className='text-right'>{t('edit')}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.map(student => (
									<TableRow key={student.id}>
										<TableCell className='font-medium'>{student.id}</TableCell>
										<TableCell>{student.username}</TableCell>
										<TableCell>{student.full_name}</TableCell>
										<TableCell>{student.expiration_date}</TableCell>
										<TableCell className='text-right'>
											<Button
												onClick={() => handlePasswordChangeClick(student)}
											>
												<Pen />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				) : (
					<div className='text-center  text-white text-lg h-[calc(100vh-150px)] flex items-center justify-center'>
						{searchTerm.trim() ? (
							t('user_not_found')
						) : (
							<Loader2 className='animate-spin' size={70} color='white' />
						)}
					</div>
				)}
				{totalPages > 1 && data.length ? (
					<div className='flex mt-auto justify-end w-full'>
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href='#'
										onClick={e => {
											e.preventDefault()
											handlePageChange(currentPage - 1)
										}}
										className={
											currentPage === 1 ? 'pointer-events-none opacity-50' : ''
										}
									/>
								</PaginationItem>

								{Array.from(
									{ length: Math.min(3, totalPages) },
									(_, i) => i + 1
								).map(page => (
									<PaginationItem key={page}>
										<PaginationLink
											href='#'
											onClick={e => {
												e.preventDefault()
												handlePageChange(page)
											}}
											isActive={page === currentPage}
										>
											{page}
										</PaginationLink>
									</PaginationItem>
								))}

								{totalPages > 3 && (
									<PaginationItem>
										<PaginationEllipsis />
									</PaginationItem>
								)}

								{totalPages > 3 && (
									<PaginationItem>
										<PaginationLink
											href='#'
											onClick={e => {
												e.preventDefault()
												handlePageChange(totalPages)
											}}
											isActive={totalPages === currentPage}
										>
											{totalPages}
										</PaginationLink>
									</PaginationItem>
								)}

								<PaginationItem>
									<PaginationNext
										href='#'
										onClick={e => {
											e.preventDefault()
											handlePageChange(currentPage + 1)
										}}
										className={
											currentPage === totalPages
												? 'pointer-events-none opacity-50'
												: ''
										}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				) : null}
			</div>
		</MainLayout>
	)
}

export default Students
