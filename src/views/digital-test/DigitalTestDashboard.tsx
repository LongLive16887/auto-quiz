import { Button } from '@/components/ui/button'
import {TrickBlockData} from "@/types"
import { Eraser } from 'lucide-react'
import { useEffect, useState } from 'react'
import MainLayout from '../../layouts/MainLayout'
import { useTranslation } from 'react-i18next'
import { DigitalTestBlock } from '@/components/DigitalTestBlock'

const BLOCKS: TrickBlockData[] = Array.from({ length: 2 }).map((_, index) => ({
  id: index,
  correct_answer: 0,
  wrong_answer: 0,
  skipped_answer: 0,
}))

const STORAGE_KEY = 'digital-test-stats'

const DigitalTestDashboard = () => {
  const [statistics, setStatistics] = useState<TrickBlockData[]>([])
  const { t } = useTranslation()


  const loadStats = () => {
    const local = localStorage.getItem(STORAGE_KEY)
    if (local) {
      setStatistics(JSON.parse(local))
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(BLOCKS))
      setStatistics(BLOCKS)
    }
  }

  const saveStats = (stats: TrickBlockData[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
    setStatistics(stats)
  }

  const handleCleanStats = () => {
    saveStats(BLOCKS)
  }

  const allStatsAreZero = statistics.every(
    stat =>
      stat.correct_answer === 0 &&
      stat.wrong_answer === 0 &&
      stat.skipped_answer === 0
  )

  useEffect(() => {
    loadStats()
  }, [])

  return (
    <MainLayout>
      <div className='flex flex-col gap-3.5'>
        {!allStatsAreZero && (
          <Button className='self-end' size='sm' onClick={handleCleanStats}>
            {t('clean_stats')}
            <Eraser className='ml-2 h-4 w-4' />
          </Button>
        )}
        <div className='flex justify-center flex-wrap gap-3.5'>
          {statistics.map(block => (
            <DigitalTestBlock key={block.id} data={block} />
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

export default DigitalTestDashboard
