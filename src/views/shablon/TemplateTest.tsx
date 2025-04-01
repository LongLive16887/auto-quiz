import AppQuiz from '@/components/quiz/AppQuiz'
import { useQuizStore } from '@/store/quiz'
import MainLayout from '../../layouts/MainLayout'

const TemplateTest = () => {
	const { quiz } = useQuizStore()
	return (
		<MainLayout>
			<AppQuiz quiz={quiz} />
		</MainLayout>
	)
}

export default TemplateTest
