import { useQuizStore } from '@/store/quiz'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

const Tabs = ({ quantity, onTabChange }: { 
  quantity: number 
  onTabChange: (index: number) => void
}) => {
  const { currentQuestionIndex, userAnswers, quiz } = useQuizStore()

  const getButtonVariant = (index: number) => {
    const answer = userAnswers[quiz[index]?.id]
    if (!answer) return 'outline'
    return answer.isCorrect ? 'succes' : 'error'
  }

  return (
    <div className="flex flex-wrap w-full gap-1 justify-center items-center max-md:flex-nowrap overflow-x-hidden">
      <div
        className={cn(
          "flex max-md:flex-nowrap flex-wrap justify-center max-md:justify-start overflow-x-auto gap-1 tabs-items__header"
        )}
      >
        {[...Array(quantity)].map((_, index) => (
          <Button
            key={index}
            size={quantity === 20 ? 'default' : 'sm'}
            variant={getButtonVariant(index)}
            onClick={() => onTabChange(index)}
            className={cn(
              currentQuestionIndex === index ? 'ring-2 ring-blue-500' : ''
            )}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default Tabs
