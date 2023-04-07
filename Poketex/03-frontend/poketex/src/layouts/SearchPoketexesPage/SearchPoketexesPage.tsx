import React, { useEffect, useState } from 'react'
import PoketexModel from '../../models/PoketexModel'
import { SpinnerLoading } from '../Utils/SpinnerLoading'
import { SearchPoketex } from './Components/SearchPoketex'
import { Pagination } from '../Utils/Pagination'
import { fetchPoketexes } from './Api/fetchPoketexes'



export const SearchPoketexesPage = () => {
    const [poketexes, setPoketexes] = useState<PoketexModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [poketexesPerPage] = useState(5);
    const [totalAmountOfPoketexes, setTotalAmountOfPoketexes] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');


    useEffect(() => {
        const fetchPoketexData = async () => {
            let baseUrl: string = "http://localhost:8084/api/poketex/recent";
            let url: string = ``;

            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${poketexesPerPage}`;
            } else {
                let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`);
                baseUrl = "http://localhost:8084";
                url = baseUrl + searchWithPage;
            }

            try {
                const result = await fetchPoketexes(url);
                setPoketexes(result.poketexes);
                setTotalAmountOfPoketexes(result.totalElements);
                setTotalPages(result.totalPages);
                setIsLoading(false);
            } catch (error: any) {
                setIsLoading(false);
                setHttpError(error.message);
            }

            window.scrollTo(0, 0);
        };

        fetchPoketexData();
    }, [currentPage, searchUrl]);


    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            searchHandleChange();
        }
    };

    const searchHandleChange = () => {
        setCurrentPage(1);

        if (search === '') {
            setSearchUrl('');
        } else {
            const searchWords = search.trim().split(/\s+/);
            const stopwords = ['a', 'the', 'an', 'and', 'or', 'in', 'on', 'at', 'with', 'by', 'made', 'without'];
            const filteredWords = searchWords.filter(word => !stopwords.includes(word.toLowerCase()));
            console.log(`/api/poketex/related?prompt=${filteredWords}&page=<pageNumber>&size=${poketexesPerPage}`);
            setSearchUrl(`/api/poketex/related?prompt=${filteredWords}&page=<pageNumber>&size=${poketexesPerPage}`);
        }
    }

    const indexOfLastPoketex: number = currentPage * poketexesPerPage;
    const indexOfFirstPoketex: number = indexOfLastPoketex - poketexesPerPage;

    let lastItem = poketexesPerPage * currentPage <= totalAmountOfPoketexes ?
        poketexesPerPage * currentPage : totalAmountOfPoketexes;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (
        <div>
            <div className='container'>
                <div>
                    <div className='row mt-5'>
                        <div className='col-6'>
                            <div className='d-flex'>
                                <input
                                    className='form-control me-2' type='search'
                                    placeholder='Search' aria-labelledby='Search'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <button className='btn btn-outline-success'
                                    onClick={() => searchHandleChange()}>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='mt-3'>
                        <h5> Number of Results: ({totalAmountOfPoketexes})</h5>
                    </div>
                    <p>
                        {indexOfFirstPoketex + 1} to {lastItem} of {totalAmountOfPoketexes} items:
                    </p>
                    {poketexes.map(poketex => (
                        <SearchPoketex poketex={poketex} key={poketex.id} />
                    ))}
                    {totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    }
                </div>
            </div>
        </div>
    )


}
