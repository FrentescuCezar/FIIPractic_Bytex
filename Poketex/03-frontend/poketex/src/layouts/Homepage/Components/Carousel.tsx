import { ReturnPokemon } from "./ReturnPokemon"
import { useEffect, useState } from "react"
import PoketexModel from "../../../models/PoketexModel"
import { SpinnerLoading } from "../../Utils/SpinnerLoading"
import { Link } from "react-router-dom"


export const Carousel = () => {

    const [poketexes, setPoketexes] = useState<PoketexModel[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [httpError, setHttpError] = useState(null)

    useEffect(() => {
        const fetchPoketex = async () => {

            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

            const url: string = "http://localhost:8084/api/pokedexes";
            console.log('Request URL:', url); // Log the request URL
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                },
            });

            console.log('Response:', response); // Log the response object

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
        <div className='container mt-5' style={{ height: 580 }}>
            <div className='homepage-carousel-title'>
                <h3>Top Pokemons by Votes</h3>
            </div>
            <div id='carouselExampleControls'
                className='carousel carousel-dark slide mt-5 d-none d-lg-block'
                data-bs-interval='false'>
                {/* Desktop*/}
                <div className='carousel-inner'>
                    <div className='carousel-item active'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {
                                poketexes.slice(0, 3).map((poketex: PoketexModel) => {
                                    return (
                                        <ReturnPokemon key={poketex.id} poketex={poketex} />
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className='carousel-item '>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {
                                poketexes.slice(3, 6).map((poketex: PoketexModel) => {
                                    return (
                                        <ReturnPokemon key={poketex.id} poketex={poketex} />
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {
                                poketexes.slice(6, 9).map((poketex: PoketexModel) => {
                                    return (
                                        <ReturnPokemon key={poketex.id} poketex={poketex} />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <button className='carousel-control-prev'
                    type='button'
                    data-bs-target='#carouselExampleControls'
                    data-bs-slide='prev'>
                    <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Previous</span>
                </button>
                <button className='carousel-control-next'
                    type='button'
                    data-bs-target='#carouselExampleControls'
                    data-bs-slide='next'>
                    <span className='carousel-control-next-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Next</span>
                </button>

            </div>

            {/* Mobile*/}
            <div className='d-lg-none mt-3'>
                <div className='row d-flex justify-content-center align-items-center'>
                    <ReturnPokemon poketex={poketexes[1]} />
                </div>
            </div>
            <div className='homepage-carousel-title mt-3'>
                <Link className='btn btn-outline-secondary btn-lg' to='/search'>View More</Link>
            </div>
        </div>
    )
}