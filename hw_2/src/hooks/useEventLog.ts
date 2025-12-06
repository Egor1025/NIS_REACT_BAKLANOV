import { useContext } from 'react'
import { EventContext } from '../context/EventContext'
import type { EventContextType } from '../context/EventContext'

export const useEventLog = (): EventContextType => useContext(EventContext)