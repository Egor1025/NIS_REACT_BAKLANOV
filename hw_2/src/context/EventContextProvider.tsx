import { useState } from 'react'
import type { ReactNode } from 'react'
import { EventContext } from './EventContext'

type Props = {
    children: ReactNode
}

export function EventContextProvider({ children }: Props) {
    const [events, setEvents] = useState<string[]>([])

    const addEvent = (msg: string) => {
        setEvents(prev => [...prev, msg])
    }

    const clearEvents = () => {
        setEvents([])
    }

    return (
        <EventContext.Provider value={{ events, addEvent, clearEvents }}>
            {children}
        </EventContext.Provider>
    )
}