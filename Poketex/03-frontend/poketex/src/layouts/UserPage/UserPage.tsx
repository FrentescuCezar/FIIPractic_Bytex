import React, { useEffect, useState } from 'react'
import PoketexModel from '../../models/PoketexModel'
import { SpinnerLoading } from '../Utils/SpinnerLoading'
import { Pagination } from '../Utils/Pagination'
import { UserPokemons } from './Components/UserPokemons'



export const UserPage = () => {
    const [poketexes, setPoketexes] = useState<PoketexModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [poketexesPerPage] = useState(8);
    const [totalAmountOfPoketexes, setTotalAmountOfPoketexes] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');

    const poketexUsername = (window.location.pathname).split("/")[2];


    useEffect(() => {
        const fetchPoketex = async () => {

            let baseUrl: string = `http://localhost:8084/api/poketex/user?username=${poketexUsername}`;
            let url: string = ``;

            if (searchUrl === '') {
                url = `${baseUrl}&page=${currentPage - 1}&size=${poketexesPerPage}`;
            } else {
                let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`);
                baseUrl = "http://localhost:8084";
                url = baseUrl + searchWithPage;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('The Servers are down. Please try again later.');
            }
            const responseJson = await response.json();

            let responseData;
            responseData = responseJson.content;
            setTotalAmountOfPoketexes(responseJson.totalElements);
            setTotalPages(responseJson.totalPages);



            const loadedPoketexes: PoketexModel[] = [];
            for (const key in responseData) {

                const data = responseData[key];
                let id: number;
                id = data.id;


                const poketex = new PoketexModel(
                    id, data.name, data.username, // Use the extracted ID here
                    data.description, data.image, data.seed,
                    data.prompt, data.steps, data.generation,
                    data.abilities, data.type1, data.type2,
                    data.hp, data.attack, data.spAttack,
                    data.defense, data.spDefense, data.speed,
                    data.baseTotal, data.baseEggSteps, data.experienceGrowth, data.parent1, data.parent2
                );
                loadedPoketexes.push(poketex);
            }

            setPoketexes(loadedPoketexes);
            setIsLoading(false);

        };
        fetchPoketex().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);

        })
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
            console.log(`/api/related?prompt=${filteredWords}&page=<pageNumber>&size=${poketexesPerPage}`);
            setSearchUrl(`/api/related?prompt=${filteredWords}&page=<pageNumber>&size=${poketexesPerPage}`);
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
