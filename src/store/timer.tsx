import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type TimerStore = {
  remainingTime: number
  hasStarted: boolean
  testType: string | null
  timerConfig: Record<string, number>
  setRemainingTime: (time: number) => void
  setHasStarted: (hasStarted: boolean) => void
  setTestType: (type: string) => void
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set) => ({
      remainingTime: 0,
      hasStarted: false,
      testType: null,
      timerConfig: {
        shablon: 10,
      },
      setRemainingTime: (time) => set({ remainingTime: time }),
      setHasStarted: (hasStarted) => set({ hasStarted }),
      setTestType: (type) => set({ testType: type }),
    }),
    {
      name: 'Timer',
      partialize: (state) => ({
        remainingTime: state.remainingTime,
        hasStarted: state.hasStarted,
        testType: state.testType,
      }),
    }
  )
)