import React, { useEffect, useState } from 'react'
import PoketexModel from '../../models/PoketexModel'
import { SpinnerLoading } from '../Utils/SpinnerLoading'
import { Pagination } from '../Utils/Pagination'
import { PokemonsForBreeding } from './Components/PokemonsForBreeding'
import { useOktaAuth } from '@okta/okta-react';
import { useHistory } from 'react-router-dom'



export const BreedingPage = () => {

    const { oktaAuth, authState } = useOktaAuth();

    const history = useHistory();


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
    const parent1 = (window.location.pathname).split("/")[4];

    const breedPokemon = async (selectedParentId: number) => {
        if (!authState.isAuthenticated) {
            alert('Please login to breed Pokémon.');
            return;
        }

        const parent1Id = parseInt(parent1);
        const parent2Id = selectedParentId;
        const token = authState.accessToken.accessToken;

        const url = 'http://localhost:8089/breedapi/breed';
        const body = {
            parent1: parent1Id,
            parent2: parent2Id,
            token,
        };

        console.log(body)

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(body),
            });



            if (!response.ok) {
                throw new Error('Failed to breed Pokémon.');
            }

            const responseData = await response.json();
            console.log(responseData);

            alert('Your Pokémon has been successfully bred.');
            history.push('/home'); // Redirect to /home page
        } catch (error) {
            console.error(error);
            alert('Failed to breed Pokémon. Please try again.');
        }
    };



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

                if (id === parseInt(parent1)) {
                    continue;
                }

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
                        <h1>Please choose a Pokemon for Breeding</h1>
                        <h5>{poketexUsername}'s Pokemons :</h5>
                    </div>
                    <p>
                        {indexOfFirstPoketex + 1} to {lastItem} of {totalAmountOfPoketexes} items:
                    </p>
                    <div className="d-flex flex-wrap justify-content-center">
                        {poketexes.map(poketex => (
                            <PokemonsForBreeding poketex={poketex} key={poketex.id} onChooseForBreeding={breedPokemon} />
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
