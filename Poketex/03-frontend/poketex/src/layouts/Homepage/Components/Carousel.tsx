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
        const fetchBestRatedPokemons = async () => {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

            const pokemonIdsUrl: string =
                "http://localhost:8086/commentapi/comments/best-rated-pokemon-ids";
            const pokemonIdsResponse = await fetch(pokemonIdsUrl);

            if (!pokemonIdsResponse.ok) {
                throw new Error("Something went wrong!");
            }
            const pokemonIds = await pokemonIdsResponse.json();


            const pokemonDetailsUrl: string =
                "http://localhost:8084/api/poketex/pokemonList";
            const pokemonDetailsResponse = await fetch(pokemonDetailsUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify(pokemonIds),
            });

            if (!pokemonDetailsResponse.ok) {
                throw new Error("Something went wrong!");
            }
            const pokemonDetails = await pokemonDetailsResponse.json();

            setPoketexes(pokemonDetails);
            setIsLoading(false);
        };

        fetchBestRatedPokemons().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        });
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


    //Only take 3 pokemons per carousel item
    const carouselItemCount = Math.floor(poketexes.length / 3);
    const carouselItems = [];
    for (let i = 0; i < carouselItemCount; i++) {
        carouselItems.push(
            <div key={`carousel-item-${i}`} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                <div className="row d-flex justify-content-center align-items-center">
                    {
                        poketexes.slice(i * 3, i * 3 + 3).map((poketex: PoketexModel) => {
                            return (
                                <ReturnPokemon key={poketex.id} poketex={poketex} />
                            );
                        })
                    }
                </div>
            </div>
        );
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
                    {carouselItems}
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