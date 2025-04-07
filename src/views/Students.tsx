import api from '@/api/axios'
import StudentPasswordChangeForm from '@/components/forms/SrudentPasswordChangeForm'
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
import MainLayout from '@/layouts/MainLayout'
import { Student } from '@/types'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { t } from 'i18next'
import { Loader2, Pen, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

const Students = () => {
	const [searchTerm, setSearchTerm] = useState('')
	const [data, setData] = useState<Student[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(10)
	const pageSize = 10
	const [showConfirm, setShowConfirm] = useState(false)
	const [showPasswordChange, setShowPasswordChange] = useState(false)
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

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

	const handleCreated = () => {
		setShowConfirm(false)
		getStudents()
	}

	const handlePasswordChange = () => {
		setShowPasswordChange(false)
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

	if (!data.length) {
		return (
			<MainLayout>
				<Loader2
					color='white'
					size={70}
					className='animate-spin h-[calc(100vh-150px)] mx-auto'
				/>
			</MainLayout>
		)
	}

	return (
		<MainLayout>
			<div>
				<div className='flex items-baseline justify-between flex-wrap gap-2'>
					{/* Search Input */}
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
								<Button>O'quvchi qo'shish</Button>
							</div>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>{t("O'quvchi qo'shish")}?</DialogTitle>
							</DialogHeader>
							<StudentForm onStudentCreated={handleCreated} />
						</DialogContent>
					</Dialog>
				</div>

				<Dialog open={showPasswordChange} onOpenChange={setShowPasswordChange}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{t("Parolni o'zgartirish")}?</DialogTitle>
						</DialogHeader>
						{/* Pass the selected student's username as a prop */}
						{selectedStudent && (
							<StudentPasswordChangeForm
								username={selectedStudent.username}
								onPasswordChange={handlePasswordChange}
							/>
						)}
					</DialogContent>
				</Dialog>

				<Table>
					<TableHeader>
						<TableRow className='text-white'>
							<TableHead className='w-[100px]'>ID</TableHead>
							<TableHead>Login</TableHead>
							<TableHead>F.I.O</TableHead>
							<TableHead>Tugash vaqti</TableHead>
							<TableHead className='text-right'>Tahirlash</TableHead>
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
									<Button onClick={() => handlePasswordChangeClick(student)}>
										<Pen />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{totalPages > 1 && (
					<div className='flex justify-end w-full'>
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious href='#' />
								</PaginationItem>
								<PaginationItem>
									<PaginationLink href='#'>1</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink href='#' isActive>
										2
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink href='#'>3</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
								<PaginationItem>
									<PaginationNext href='#' />
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				)}
			</div>
		</MainLayout>
	)
}

export default Students
