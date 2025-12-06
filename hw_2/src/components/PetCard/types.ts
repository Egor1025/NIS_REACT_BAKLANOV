export type Pet = {
    id: string
    name: string
    species: string
    mood: string
    energy: number
    level: number
    avatar: string
}

export type PetState = Pet

export type PetAction =
    | { type: 'FEED' }
    | { type: 'LEVEL_UP' }
    | { type: 'CHEER' }
    | { type: 'RESET' }
    | { type: 'TICK' }