import { useEffect, useReducer, useRef } from 'react'
import type { Pet, PetState, PetAction } from '../components/PetCard/types'

const getMoodByEnergy = (energy: number): string => {
    if (energy <= 0) return 'offline'
    if (energy <= 20) return 'sad'
    if (energy <= 40) return 'tired'
    if (energy <= 70) return 'neutral'
    return 'happy'
}

export const usePetLifecycle = (initial: Pet, tickInterval: number = 5000) => {
    const initialRef = useRef<Pet>(initial)

    const reducer = (state: PetState, action: PetAction): PetState => {
        if (state.energy <= 0 && action.type !== 'RESET') {
            if (state.mood !== 'offline') {
                return {
                    ...state,
                    energy: 0,
                    mood: 'offline'
                }
            }
            return state
        }

        switch (action.type) {
            case 'FEED': {
                const nextEnergy = Math.min(100, state.energy + 20)
                return {
                    ...state,
                    energy: nextEnergy,
                    mood: getMoodByEnergy(nextEnergy)
                }
            }
            case 'LEVEL_UP': {
                return {
                    ...state,
                    level: state.level + 1
                }
            }
            case 'CHEER': {
                if (state.energy <= 20) {
                    return {
                        ...state,
                        mood: 'sad'
                    }
                }
                return {
                    ...state,
                    mood: 'happy'
                }
            }
            case 'RESET': {
                const base = initialRef.current
                return {
                    ...base,
                    mood: getMoodByEnergy(base.energy)
                }
            }
            case 'TICK': {
                const nextEnergy = Math.max(0, state.energy - 5)
                return {
                    ...state,
                    energy: nextEnergy,
                    mood: getMoodByEnergy(nextEnergy)
                }
            }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, {
        ...initial,
        mood: getMoodByEnergy(initial.energy)
    })

    useEffect(() => {
        const id = window.setInterval(() => {
            dispatch({ type: 'TICK' })
        }, tickInterval)

        return () => {
            window.clearInterval(id)
        }
    }, [tickInterval])

    const isDisabled = state.energy <= 0

    return {
        state,
        dispatch,
        isDisabled
    }
}