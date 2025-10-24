import { useState, useEffect } from 'react';
import { Movie } from '../types';
import { fetchMovies } from './api';


export function useMovies() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchMovies();
                setMovies(data);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Ошибка загрузки');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return { movies, setMovies, loading, error };
}