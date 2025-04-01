import { useQuizStore } from '@/store/quiz'
import { Button } from '../ui/button'

const Tabs = ({ quantity, onTabChange }: { 
  quantity: number 
  onTabChange: (index: number) => void
}) => {
  const { currentQuestionIndex, userAnswers, quiz } = useQuizStore()
  
  const getButtonVariant = (index: number) => {
    const answer = userAnswers[quiz[index]?.id]
    if (!answer) return 'outline'
    return answer.isCorrect ? 'succes' : 'destructive'
  }

  return (
    <div className="flex flex-wrap w-full gap-1 justify-center items-center">
      {[...Array(quantity)].map((_, index) => (
        <Button
          key={index}
          size={quantity === 20 ? 'default' : 'sm'}
          variant={getButtonVariant(index)}
          onClick={() => onTabChange(index)}
          className={`${
            currentQuestionIndex === index ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          {index + 1}
        </Button>
      ))}
    </div>
  )
}

export default Tabs