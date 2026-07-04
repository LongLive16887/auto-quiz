import { useParams, useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { useQuizStore } from '@/store/quiz'
import MainLayout from '@/layouts/MainLayout'
import { useTranslation } from 'react-i18next'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
const MarathonParts = () => {
    const { limit } = useParams<{ limit: string }>()
    const navigate = useNavigate()
    const { loadMarathonQuiz } = useQuizStore()
    const { t } = useTranslation()

    const numericLimit = Number(limit)
    const [selectedPage, setSelectedPage] = useState<number | null>(null)
    const [open, setOpen] = useState(false)

    const squaresCount = useMemo(() => {
        if (numericLimit === 300) return 5
        if (numericLimit === 600) return 3
        return 0
    }, [numericLimit])

    const handleStart = () => {
        if (selectedPage === null) return
        loadMarathonQuiz(numericLimit, selectedPage - 1)
        navigate(`/template/${numericLimit}?type=marathon`)
    }

    return (
        <MainLayout>
            <div className="flex flex-col items-center gap-6">
                <div className="flex gap-4 w-full flex-wrap">
                    {Array.from({ length: squaresCount }).map((_, index) => {
                        const page = index + 1

                        return (
                            <div
                                key={page}
                                onClick={() => { setSelectedPage(page); setOpen(true) }}
                                className={`
                                w-72 h-72 flex items-center justify-center text-xl
                                cursor-pointer rounded-lg border transition bg-white/10 text-white hover:bg-white/20
                            `}
                            >
                                {page} {t("block")}
                            </div>
                        )
                    })}
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className='sm:max-w-[425px]'>
                        <DialogHeader>
                            <DialogTitle>{t('start')}</DialogTitle>
                        </DialogHeader>
                        <DialogFooter>
                            <div className='flex items-center gap-2'>
                                <Button variant='secondary' onClick={() => setOpen(false)}>
                                    {t('back')}
                                </Button>
                                <Button onClick={handleStart}>{t('start_test')}</Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    )
}

export default MarathonParts
