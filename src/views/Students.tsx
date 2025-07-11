import api from '@/api/axios'
import StudentPasswordChangeForm from '@/components/forms/SrudentPasswordChangeForm'
import StudentEditForm from '@/components/forms/StudentEditForm'
import StudentForm from '@/components/forms/StudentForm'
import ResultsTabs from '@/components/ResultsTabs'
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
import { CornerUpLeft, Eye, Loader2, Pen, Search, TrashIcon, ClipboardCopy, Check } from 'lucide-react';
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
	const [showResults, setShowResults] = useState(false)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
	const [copiedId, setCopiedId] = useState<number | null>(null);


	const [selectedResultStudent, setSelectedResultStudent] = useState<
		number | null
	>(null)
	const [selectedStudentName, setSelectedStudentName] = useState<string | null>(
		null
	)
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

	const handleCopy = async (id: number) => {
		const url = `https://avtotest-begzod.uz/share-app/mobile?referrer_id=${id}`;
		await navigator.clipboard.writeText(url);
		setCopiedId(id);
		setTimeout(() => {
			setCopiedId(null);
		}, 2000);
	};


	const handlePasswordChange = () => {
		setShowConfirm(false)
		setShowPasswordChange(false)
		getStudents()
	}

	const handleShowResult = (student: Student) => {
		setSelectedResultStudent(student.id)
		setSelectedStudentName(student.full_name)
		setShowResults(true)
		// getStudents()
	}

	const handlePasswordChangeClick = (student: Student) => {
		setSelectedStudent(student)
		setShowPasswordChange(true)
	}

	const handleUserDelete = (student: Student) => {
		setStudentToDelete(student)
		setShowDeleteConfirm(true)
	}

	const confirmDelete = () => {
		if (studentToDelete) {
			api.delete(`api/v1/auth?id=${studentToDelete.id}`).then(() => {
				setShowDeleteConfirm(false)
				setStudentToDelete(null)
				getStudents(searchTerm, currentPage)
			})
		}
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

	const renderPagination = () => {
		const pages = []
		const range = 2
		const start = Math.max(1, currentPage - range)
		const end = Math.min(totalPages, currentPage + range)

		if (start > 1) {
			pages.push(
				<PaginationItem key={1}>
					<PaginationLink href="#" onClick={e => { e.preventDefault(); handlePageChange(1) }}>1</PaginationLink>
				</PaginationItem>
			)
			if (start > 2) pages.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>)
		}

		for (let i = start; i <= end; i++) {
			pages.push(
				<PaginationItem key={i}>
					<PaginationLink
						href="#"
						onClick={e => { e.preventDefault(); handlePageChange(i) }}
						isActive={i === currentPage}
					>{i}</PaginationLink>
				</PaginationItem>
			)
		}

		if (end < totalPages) {
			if (end < totalPages - 1) pages.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>)
			pages.push(
				<PaginationItem key={totalPages}>
					<PaginationLink href="#" onClick={e => { e.preventDefault(); handlePageChange(totalPages) }}>{totalPages}</PaginationLink>
				</PaginationItem>
			)
		}

		return pages
	}

	return (
		<MainLayout>
			<Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Tasdiqlash</DialogTitle>
						<p>Rostdan ham bu o'quvchini o'chirmoqchimisiz?</p>
					</DialogHeader>
					<div className='flex justify-end gap-4 mt-4'>
						<Button variant='ghost' onClick={() => setShowDeleteConfirm(false)}>
							Bekor qilish
						</Button>
						<Button variant='error' onClick={confirmDelete}>
							O'chirish
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<div className='flex flex-col h-full'>
				{showResults && selectedResultStudent ? (
					<>
						<div className='flex  gap-4 items-center mb-4'>
							<Button
								onClick={() => {
									setShowResults(false)
									setSelectedResultStudent(null)
								}}
							>
								<CornerUpLeft />
								Orqaga
							</Button>
							<h2 className='text-lg font-semibold text-white'>
								O'quvchi: {selectedStudentName}
							</h2>
						</div>
						<ResultsTabs studentId={selectedResultStudent} />
					</>
				) : (
					<>
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

						<Dialog
							open={showPasswordChange}
							onOpenChange={setShowPasswordChange}
						>
							<DialogContent className='max-w-2xl'>
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
											<TableHead className='text-center'>Natijalar</TableHead>
											<TableHead className='text-right'>{t('edit')}</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{data.map(student => (
											<TableRow key={student.id}>
												<TableCell className='font-medium flex items-center gap-2'>
													<span className="inline-block min-w-[40px]">{student.id}</span>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleCopy(student.id)}
														className="p-1 h-auto w-auto"
													>
														{copiedId === student.id ? (
															<Check className="text-green-500 w-4 h-4" />
														) : (
															<ClipboardCopy className="w-4 h-4" />
														)}
													</Button>
												</TableCell>

												<TableCell>{student.username}</TableCell>
												<TableCell>{student.full_name}</TableCell>
												<TableCell>{student.expiration_date}</TableCell>
												<TableCell className='flex justify-center'>
													<Button
														className='flex justify-end '
														onClick={() => handleShowResult(student)}
													>
														<Eye />
													</Button>
												</TableCell>
												<TableCell className='text-right'>
													<div className='flex justify-end gap-3'>
														<Button
															onClick={() => handlePasswordChangeClick(student)}
														>
															<Pen />
														</Button>
														<Button
															onClick={() => handleUserDelete(student)}
															variant={'error'}
														>
															<TrashIcon />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						) : (
							<div className='text-center text-white text-lg h-[calc(100vh-150px)] flex items-center justify-center'>
								{searchTerm.trim() ? (
									t('user_not_found')
								) : (
									<Loader2 className='animate-spin' size={70} color='white' />
								)}
							</div>
						)}

						{totalPages > 1 && data.length > 0 && (
							<div className='flex mt-auto justify-end w-full'>
								<Pagination>
									<PaginationContent>
										<PaginationItem>
											<PaginationPrevious
												href="#"
												onClick={e => { e.preventDefault(); handlePageChange(currentPage - 1) }}
												className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
											/>
										</PaginationItem>

										{renderPagination()}

										<PaginationItem>
											<PaginationNext
												href="#"
												onClick={e => { e.preventDefault(); handlePageChange(currentPage + 1) }}
												className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
											/>
										</PaginationItem>
									</PaginationContent>
								</Pagination>
							</div>
						)}
					</>
				)}
			</div>
		</MainLayout>
	)
}

export default Students
