import { SyntheticEvent, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MatchContext } from '../contexts/match.context';
import { iFilm, iFilmSearch } from '../models/interface';
import { Match } from '../models/Match';
import { FilmHttpStore } from '../services/films.http.store';

export function List({ weather }: { weather: string }) {
    const { addMatch } = useContext(MatchContext);

    const initialPrintSearch: iFilmSearch = {
        results: [
            {
                id: 0,
                overview: '',
                poster_path: '',
                release_date: '',
                title: '',
                vote_average: 0,
            },
        ],
    };
    const [search, setSearch] = useState('');
    const [printSearch, setPrintSearch] = useState(initialPrintSearch);
    useEffect(() => {
        if (search.length >= 3) {
            searchPrint(search).then((resp) => setPrintSearch(resp));
        }
    }, [search]);

    function handlerChange(ev: SyntheticEvent) {
        const eventTarget = ev.target as HTMLFormElement;
        setSearch(eventTarget.value);
    }
    function orderBy(ev: SyntheticEvent) {
        let order: iFilmSearch = {
            results: [
                {
                    id: 0,
                    overview: '',
                    poster_path: '',
                    release_date: '',
                    title: '',
                    vote_average: 0,
                },
            ],
        };
        order = {
            results: printSearch.results.sort((a, b) =>
                a.title.localeCompare(b.title)
            ),
        };
        setPrintSearch(order);
    }

    async function searchPrint(search: string) {
        return await new FilmHttpStore().getSearchFilms(search);
    }

    async function handlerAdd(film: iFilm) {
        const newMatch = await new Match(weather, film.id);
        return addMatch(newMatch);
    }

    const template = (
        <>
            <div className="search-order">
                <div>
                    <img src="./img/icons8-búsqueda-30.png" alt="lupa" />

                    <input
                        type="text"
                        value={search}
                        onChange={(ev) => handlerChange(ev)}
                    />
                </div>

                <select
                    className="config__selector"
                    name="sort-config"
                    id="sort-config-match"
                    onChange={(ev) => orderBy(ev)}
                >
                    <option value="">ordenar por</option>
                    <option value="alphabetic">alfabeticamente</option>
                    <option value="age-">año (menos a mas)</option>
                    <option value="age+">año (mas a menos)</option>
                </select>
            </div>

            <div>
                <ul className="search">
                    {printSearch.results.map(
                        (item) =>
                            item.poster_path !== null && (
                                <li className="search__list" key={item.title}>
                                    <Link to={`/details/${item.id}`}>
                                        <img
                                            className="search__img"
                                            src={`https://image.tmdb.org/t/p/w1280/${item.poster_path}`}
                                            alt={item.title}
                                        />{' '}
                                    </Link>
                                    <span>
                                        {item.title +
                                            '  (' +
                                            item.release_date +
                                            ')'}
                                    </span>

                                    <button onClick={() => handlerAdd(item)}>
                                        ➕
                                    </button>
                                </li>
                            )
                    )}
                </ul>
            </div>
        </>
    );
    return template;
}
