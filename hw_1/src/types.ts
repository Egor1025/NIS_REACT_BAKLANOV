export type Movie = {
    id: number;
    title: string;
    year: number;
    posterUrl: string;
    isFavorite: boolean;
};

export type ViewMode = 'grid' | 'list';
export type FilterMode = 'all' | 'favorites';