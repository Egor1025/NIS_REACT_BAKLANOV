import { FC } from 'react';
import { Movie } from '../types';
import './MovieCard.css';

type Props = {
    movie: Movie;
    onToggleFavorite: (id: number) => void;
    view: 'grid' | 'list';
};

export const MovieCard: FC<Props> = ({ movie, onToggleFavorite, view }) => {
    return (
        <article className={`card card--${view}`}>
            <img
                className="card__poster"
                src={movie.posterUrl}
                alt={`${movie.title} (${movie.year})`}
                loading="lazy"
            />
            <div className="card__body">
                <div>
                    <h3 className="card__title">{movie.title}</h3>
                    <p className="card__year">{movie.year}</p>
                </div>
                <button
                    className={`card__fav ${movie.isFavorite ? 'is-active' : ''}`}
                    aria-pressed={movie.isFavorite}
                    onClick={() => onToggleFavorite(movie.id)}
                >
                    <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                        <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                    </svg>
                </button>
            </div>
        </article>
    );
};