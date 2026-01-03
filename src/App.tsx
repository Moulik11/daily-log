import { LogProvider } from '@/context/LogContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { Timeline } from '@/components/timeline/Timeline'
import './index.css'

function App() {
    return (
        <LogProvider>
            <AppLayout>
                <Timeline />
            </AppLayout>
        </LogProvider>
    )
}

export default App
