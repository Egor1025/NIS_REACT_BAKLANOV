import { useEffect, useMemo, useState } from 'react'
import PetCard from '../components/PetCard/PetCard'
import type { Pet } from '../components/PetCard/types'
import petsData from '../data/pets.json'
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Skeleton,
    Button
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'

type PetsResponse = Pet[]

const loadPets = (): Promise<PetsResponse> =>
    new Promise(resolve => {
        window.setTimeout(() => {
            resolve(petsData as PetsResponse)
        }, 1000)
    })

function Dashboard() {
    const [pets, setPets] = useState<Pet[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [speciesFilter, setSpeciesFilter] = useState<string>('all')

    useEffect(() => {
        loadPets().then(data => {
            setPets(data)
            setIsLoading(false)
        })
    }, [])

    const speciesOptions = useMemo(
        () => Array.from(new Set(pets.map(pet => pet.species))),
        [pets]
    )

    const handleChange = (event: SelectChangeEvent) => {
        setSpeciesFilter(event.target.value)
    }

    const clearFilter = () => {
        setSpeciesFilter('all')
    }

    const filteredPets = useMemo(
        () =>
            speciesFilter === 'all'
                ? pets
                : pets.filter(pet => pet.species === speciesFilter),
        [pets, speciesFilter]
    )

    const skeletons = useMemo(() => Array.from({ length: 4 }), [])

    return (
        <div className="app-root">
            <main className="app-main">
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    marginBottom="16px"
                >
                    <Box fontSize="24px" fontWeight={600}>
                        CyberZoo
                    </Box>
                    <Box display="flex" gap="12px">
                        <FormControl size="small" sx={{ minWidth: '180px' }}>
                            <InputLabel id="species-label">Вид</InputLabel>
                            <Select
                                labelId="species-label"
                                value={speciesFilter}
                                label="Вид"
                                onChange={handleChange}
                            >
                                <MenuItem value="all">Все виды</MenuItem>
                                {speciesOptions.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="outlined" onClick={clearFilter}>
                            Сбросить фильтр
                        </Button>
                    </Box>
                </Box>

                <div className="app-grid">
                    {isLoading
                        ? skeletons.map((_, index) => (
                            <Skeleton
                                key={index}
                                variant="rectangular"
                                width="100%"
                                height="200px"
                            />
                        ))
                        : filteredPets.map(pet => <PetCard key={pet.id} data={pet} />)}
                </div>
            </main>
        </div>
    )
}

export default Dashboard