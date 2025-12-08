import { memo, useCallback, useRef } from 'react'
import styles from './PetCard.module.scss'
import type { Pet } from './types'
import { usePetLifecycle } from '../../hooks/usePetLifecycle'
import { useEventLog } from '../../hooks/useEventLog'
import { ActionButton, DangerButton } from '../PetActions/ActionButton.styled'

type Props = {
    data: Pet
}

const PetCard = memo(({ data }: Props) => {
    const { state, dispatch, isDisabled } = usePetLifecycle(data)
    const { addEvent } = useEventLog()

    const avatarRef = useRef<HTMLImageElement | null>(null)

    const glow =
        state.mood === 'happy'
            ? '0 0 12px gold'
            : state.mood === 'sad'
                ? '0 0 12px red'
                : '0 0 6px gray'

    const feed = useCallback(() => {
        dispatch({ type: 'FEED' })
        addEvent(state.name + ' был накормлен')
    }, [dispatch, addEvent, state.name])

    const levelup = useCallback(() => {
        dispatch({ type: 'LEVEL_UP' })
        addEvent(state.name + ' поднял уровень')
    }, [dispatch, addEvent, state.name])

    const cheer = useCallback(() => {
        dispatch({ type: 'CHEER' })
        addEvent(state.name + ' приободрен')
    }, [dispatch, addEvent, state.name])

    const reset = useCallback(() => {
        dispatch({ type: 'RESET' })
        addEvent(state.name + ' сброшен до исходного состояния')
    }, [dispatch, addEvent, state.name])

    return (
        <div className={styles.card} style={{ boxShadow: glow }}>
            <div className={styles.header}>
                <span>{state.name}</span>
                <img
                    ref={avatarRef}
                    src={state.avatar}
                    alt={state.name}
                    className={styles.avatar}
                />
            </div>

            <div className={styles.stats}>
                <span>Настроение: {state.mood}</span>
                <span>Энергия: {state.energy}</span>
                <span>Уровень: {state.level}</span>
                <span>Вид: {state.species}</span>
            </div>

            <div className={styles.buttons}>
                <ActionButton onClick={feed} disabled={isDisabled}>Feed</ActionButton>
                <ActionButton onClick={levelup} disabled={isDisabled}>Level Up</ActionButton>
                <ActionButton onClick={cheer} disabled={isDisabled}>Cheer</ActionButton>
                <DangerButton onClick={reset}>Reset</DangerButton>
            </div>
        </div>
    )
})

export default PetCard