import React, { FC, useRef } from 'react';
import { FilterMode, ViewMode } from '../types';
import './Toolbar.css';

type Props = {
    filterMode: FilterMode;
    onChangeFilter: (mode: FilterMode) => void;
    onSearchApply: (query: string) => void;
    onClearSearch: () => void;
    viewMode: ViewMode;
    onChangeView: (view: ViewMode) => void;
};

export const Toolbar: FC<Props> = ({
                                       filterMode,
                                       onChangeFilter,
                                       onSearchApply,
                                       onClearSearch,
                                       viewMode,
                                       onChangeView,
                                   }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const apply = () => {
        onSearchApply(inputRef.current?.value ?? '');
    };

    const clear = () => {
        if (inputRef.current) inputRef.current.value = '';
        onClearSearch();
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') apply();
    };

    return (
        <div className="toolbar">
            <div className="toolbar__group">
                <span className="toolbar__label">Фильтр:</span>
                <button
                    className={`btn ${filterMode === 'all' ? 'is-active' : ''}`}
                    onClick={() => onChangeFilter('all')}
                >
                    Все
                </button>
                <button
                    className={`btn ${filterMode === 'favorites' ? 'is-active' : ''}`}
                    onClick={() => onChangeFilter('favorites')}
                >
                    Избранные
                </button>
            </div>

            <div className="toolbar__group inp">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Поиск по названию..."
                    onKeyDown={onKeyDown}
                />
                <button className="btn" onClick={apply}>Искать</button>
                <button className="btn btn--ghost" onClick={clear}>Сбросить</button>
            </div>

            <div className="toolbar__group">
                <span className="toolbar__label">Вид:</span>
                <button
                    className={`btn ${viewMode === 'grid' ? 'is-active' : ''} btn__svg`}
                    onClick={() => onChangeView('grid')}
                    title="Плитка"
                >
                    <svg height="24px" viewBox="0 -960 960 960" fill="#e3e3e3">
                        <path d="M200-520q-33 0-56.5-23.5T120-600v-160q0-33 23.5-56.5T200-840h160q33 0 56.5 23.5T440-760v160q0 33-23.5 56.5T360-520H200Zm0 400q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h160q33 0 56.5 23.5T440-360v160q0 33-23.5 56.5T360-120H200Zm400-400q-33 0-56.5-23.5T520-600v-160q0-33 23.5-56.5T600-840h160q33 0 56.5 23.5T840-760v160q0 33-23.5 56.5T760-520H600Zm0 400q-33 0-56.5-23.5T520-200v-160q0-33 23.5-56.5T600-440h160q33 0 56.5 23.5T840-360v160q0 33-23.5 56.5T760-120H600Z"/>
                    </svg>
                </button>
                <button
                    className={`btn ${viewMode === 'list' ? 'is-active' : ''} btn__svg`}
                    onClick={() => onChangeView('list')}
                    title="Список"
                >
                    <svg height="24px" viewBox="0 -960 960 960" fill="#e3e3e3">
                        <path d="M400-160q-33 0-56.5-23.5T320-240q0-33 23.5-56.5T400-320h400q33 0 56.5 23.5T880-240q0 33-23.5 56.5T800-160H400Zm0-240q-33 0-56.5-23.5T320-480q0-33 23.5-56.5T400-560h400q33 0 56.5 23.5T880-480q0 33-23.5 56.5T800-400H400Zm0-240q-33 0-56.5-23.5T320-720q0-33 23.5-56.5T400-800h400q33 0 56.5 23.5T880-720q0 33-23.5 56.5T800-640H400Zm-240 0q-33 0-56.5-23.5T80-720q0-33 23.5-56.5T160-800q33 0 56.5 23.5T240-720q0 33-23.5 56.5T160-640Zm0 240q-33 0-56.5-23.5T80-480q0-33 23.5-56.5T160-560q33 0 56.5 23.5T240-480q0 33-23.5 56.5T160-400Zm0 240q-33 0-56.5-23.5T80-240q0-33 23.5-56.5T160-320q33 0 56.5 23.5T240-240q0 33-23.5 56.5T160-160Z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};