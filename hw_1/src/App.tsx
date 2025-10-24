import { useMemo, useState } from 'react';
import {FilterMode, ViewMode} from './types';
import { MovieCard } from './components/MovieCard';
import { Toolbar } from './components/Toolbar';
import { useMovies } from './api/useMovies';


function App() {
    const { movies, setMovies, loading, error } = useMovies();

    const [filterMode, setFilterMode] = useState<FilterMode>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    // Здесь хранится только зафиксированный поисковый запрос, который обновляется при выполнении поиска
    // Само значение инпута лежит в ref внутри Toolbar
    const [searchQuery, setSearchQuery] = useState<string>('');

    const toggleFavorite = (id: number) => {
        setMovies(prev =>
            prev.map(m => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m))
        );
    };

    const filtered = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return movies
            .filter(m => (filterMode === 'favorites' ? m.isFavorite : true))
            .filter(m => (q ? m.title.toLowerCase().includes(q) : true));
    }, [movies, filterMode, searchQuery]);


    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <main className="container">
            <h1>Каталог фильмов</h1>

            <Toolbar
                filterMode={filterMode}
                onChangeFilter={setFilterMode}
                onSearchApply={setSearchQuery}
                onClearSearch={() => setSearchQuery('')}
                viewMode={viewMode}
                onChangeView={setViewMode}
            />

            {filtered.length === 0 ? (
                <p className="empty">Фильмов нет</p>
            ) : (
                <section className={`grid grid--${viewMode}`}>
                    {filtered.map(movie => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            onToggleFavorite={toggleFavorite}
                            view={viewMode}
                        />
                    ))}
                </section>
            )}
        </main>
    );
}

export default App;