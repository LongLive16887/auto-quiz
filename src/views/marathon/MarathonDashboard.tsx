import { useNavigate } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'

const MarathonDashboard = () => {
    const navigate = useNavigate()

    const handleButtonClick = (value: string) => {
        navigate(`/marathon-test/${value}`)
    }

    return (
        <MainLayout>
            <div className='space-x-4'>
                <div className='flex items-center justify-center gap-3.5'>
                    <div
                        onClick={() => handleButtonClick('300')}
                        className='max-w-[350px] flex w-full text-2xl justify-center items-center  py-10 bg-white/10 backdrop-blur-lg text-white cursor-pointer rounded-lg border hover:shadow-sm transition'
                    >
                        300
                    </div>
                    <div
                        onClick={() => handleButtonClick('600')}
                        className='max-w-[350px] w-full flex text-2xl py-10 justify-center items-center bg-white/10 backdrop-blur-lg text-white cursor-pointer rounded-lg border hover:shadow-sm transition'
                    >
                        600
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default MarathonDashboard
