import { Movie } from '../types';

const API_KEY = process.env.REACT_APP_KINOPOISK_TOKEN as string;

type MovieResponse = {
    docs: {
        id: number;
        name: string;
        year: number;
        poster?: {url: string};
        rating: number;
    }[];
    total: number;
};

export async function fetchMovies(): Promise<Movie[]> {
    const endpoint = `https://api.kinopoisk.dev/v1.4/movie?page=1&limit=250&selectFields=id&selectFields=name&selectFields=year&selectFields=poster&type=movie&rating.kp=8-10`;

    const res = await fetch(endpoint, {
        headers: { 'X-API-KEY': API_KEY },
    });
    if (!res.ok) {throw new Error(`Ошибка ${res.status}: ${res.statusText}`);}

    const data: MovieResponse = await res.json();
    return data.docs.map((m) => ({
        id: m.id,
        title: m.name,
        year: m.year,
        posterUrl: m.poster?.url || 'no poster',
        isFavorite: false,
    }));
}
