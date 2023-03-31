import React, { useEffect, useState } from 'react'
import PoketexModel from '../../models/PoketexModel'
import { SpinnerLoading } from '../Utils/SpinnerLoading'
import { SearchPoketex } from './Components/SearchPoketex'

export const SearchPoketexesPage = () => {
    const [poketexes, setPoketexes] = useState<PoketexModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [httpError, setHttpError] = useState(null)
    



    useEffect(() => {
        const fetchPoketex = async () => {

            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

            const url: string = "/api/pokedexes";
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const responseData = responseJson._embedded.pokedexes;

            const loadedPoketexes: PoketexModel[] = [];
            for (const key in responseData) {
                const data = responseData[key];
                const poketex = new PoketexModel(
                    data.id, data.name, data.username,
                    data.description, data.image, data.seed,
                    data.prompt, data.steps, data.generation,
                    data.abilities, data.type1, data.type2,
                    data.hp, data.attack, data.spAttack,
                    data.defense, data.spDefense, data.speed,
                    data.baseTotal, data.baseEggSteps, data.experienceGrowth
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
    }, []);



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


    return (
        <div>
            <div className='container'>
                <div>
                    <div className='row mt-5'>
                        <div className='col-6'>
                            <div className='d-flex'>
                                <input className='form-control me-2' type='search'
                                    placeholder='Search' aria-labelledby='Search' />
                                <button className='btn btn-outline-success'> Search</button>
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className='dropdown'>
                                <button className='btn btn-secondary dropdown-toggle' type='button'
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                    Category
                                </button>
                                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li>
                                        <a className='dropdown-item' href='#'>
                                            All
                                        </a>
                                    </li>
                                    <li>
                                        <a className='dropdown-item' href='#'>
                                            Jeg
                                        </a>
                                    </li>
                                    <li>
                                        <a className='dropdown-item' href='#'>
                                            Cacat
                                        </a>
                                    </li>
                                    <li>
                                        <a className='dropdown-item' href='#'>
                                            Pisat
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='mt-3'>
                        <h5> Number of Results: (22)</h5>
                    </div>
                    <p>
                        1 to 5 of 22 items:
                    </p>
                    {poketexes.map(poketex => (
                        <SearchPoketex poketex={poketex} key={poketex.id} />
                    ))}
                </div>
            </div>
        </div>
    )






}
