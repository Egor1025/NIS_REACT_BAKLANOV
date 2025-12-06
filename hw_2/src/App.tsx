import Dashboard from './pages/Dashboard'
import { EventContextProvider } from './context/EventContextProvider'
import EventLog from './components/EventLog/EventLog'

function App() {
    return (
        <EventContextProvider>
            <Dashboard />
            <EventLog />
        </EventContextProvider>
    )
}

export default App