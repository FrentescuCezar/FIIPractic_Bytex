import React, { useEffect, useState } from 'react'
import PoketexModel from '../../models/PoketexModel'
import { SpinnerLoading } from '../Utils/SpinnerLoading'
import { Pagination } from '../Utils/Pagination'
import { UserPokemons } from './Components/UserPokemons'
import fetchPoketex from './Api/fetchRelatedPoketex'



export const UserPage = () => {
    const [poketexes, setPoketexes] = useState<PoketexModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [poketexesPerPage] = useState(8);
    const [totalAmountOfPoketexes, setTotalAmountOfPoketexes] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const poketexUsername = (window.location.pathname).split("/")[2];


    useEffect(() => {
        fetchPoketex(currentPage, poketexUsername, poketexesPerPage)
            .then((result) => {
                setPoketexes(result.loadedPoketexes);
                setIsLoading(false);
                setTotalAmountOfPoketexes(result.totalAmountOfPoketexes);
                setTotalPages(result.totalPages);
            })
            .catch((error) => {
                setIsLoading(false);
                setHttpError(error.message);
            });
    }, [currentPage]);



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


    const indexOfLastPoketex: number = currentPage * poketexesPerPage;
    const indexOfFirstPoketex: number = indexOfLastPoketex - poketexesPerPage;

    let lastItem = poketexesPerPage * currentPage <= totalAmountOfPoketexes ?
        poketexesPerPage * currentPage : totalAmountOfPoketexes;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (
        <div>
            <div className='container'>
                <div>

                    <div className='mt-5'>
                        <h1>Pokemons created by</h1>
                        <h4>{poketexUsername} :</h4>
                    </div>
                    <p>
                        {indexOfFirstPoketex + 1} to {lastItem} of {totalAmountOfPoketexes} items:
                    </p>
                    <div className="d-flex flex-wrap justify-content-center">
                        {poketexes.map(poketex => (
                            <UserPokemons poketex={poketex} key={poketex.id} />
                        ))}
                    </div>
                    {totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    }
                </div>
            </div>
        </div>
    )






}
