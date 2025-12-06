import { createContext } from 'react'

export type EventContextType = {
    events: string[]
    addEvent: (msg: string) => void
    clearEvents: () => void
}

export const EventContext = createContext<EventContextType>({
    events: [],
    addEvent: () => {},
    clearEvents: () => {}
})