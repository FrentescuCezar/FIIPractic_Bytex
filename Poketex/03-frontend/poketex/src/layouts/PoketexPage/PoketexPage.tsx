import { useEffect, useState } from 'react'
import PoketexModel from '../../models/PoketexModel';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { ReviewBox } from './ReviewBox';
import CommentModel from '../../models/CommentModel';

export const PoketexPage = () => {

    const [poketex, setPoketex] = useState<PoketexModel>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [httpError, setHttpError] = useState(null);

    // Comment state
    const [comment, setComment] = useState<CommentModel[]>([])
    const [totalStars, setTotalStars] = useState<number>(0)
    const [isLoadingComment, setIsLoadingComment] = useState<boolean>(true)

    const poketexId = (window.location.pathname).split("/")[2]; //localhost:3000/pokemon/1


    useEffect(() => {
        const fetchPoketex = async () => {

            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

            const baseUrl: string = `http://localhost:8084/api/pokedexes/${poketexId}`;
            const response = await fetch(baseUrl, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const data = await response.json();

            const loadedPoketex: PoketexModel = {
                id: data.id,
                name: data.name,
                username: data.username,
                description: data.description,
                image: data.image,
                seed: data.seed,
                prompt: data.prompt,
                steps: data.steps,
                generation: data.generation,
                abilities: data.abilities,
                type1: data.type1,
                type2: data.type2,
                hp: data.hp,
                attack: data.attack,
                spAttack: data.spAttack,
                defense: data.defense,
                spDefense: data.spDefense,
                speed: data.speed,
                baseTotal: data.baseTotal,
                baseEggSteps: data.baseEggSteps,
                experienceGrowth: data.experienceGrowth,
            };

            setPoketex(loadedPoketex);
            setIsLoading(false);

        };
        fetchPoketex().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, []);


    useEffect(() => {
        const fetchComments = async () => {
            const commentUrl: string = 'http://localhost:8080/api/comments/search/findByPokemonId?PokemonId=' + poketexId;
        }
    })


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
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-3 d-flex flex-column align-items-center'>
                        {poketex?.image ?
                            <img src={`data:image/png;base64,${poketex.image}`} width='350' height='350' alt='Pokemon' />
                            :
                            <img src='https://via.placeholder.com/256' width='256' height='256' alt='Pokemon' />
                        }
                        <div className='mt-3 text-center'>
                            <h1>{poketex?.name}</h1>
                            <h5 className='text-primary'>{poketex?.username}</h5>
                            <h6>"{poketex?.prompt}"</h6>
                        </div>
                    </div>
                    <div className='col-4 col-md-7 container'>
                        <div className='ml-2'>
                            <p className='lead'>{poketex?.description}</p>
                        </div>
                    </div>
                    <ReviewBox poketex={poketex} mobile={false} />
                </div>
            </div>

            {/* MOBILE */}
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center align-items-center'>
                    {poketex?.image ?
                        <img src={`data:image/png;base64,${poketex.image}`} width='256' height='256' alt='Pokemon' />
                        :
                        <img src='https://via.placeholder.com/256' width='256' height='256' alt='Pokemon' />
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{poketex?.name}</h2>
                        <h5 className='text-primary'>{poketex?.username}</h5>
                        <p className='lead'>{poketex?.description}</p>
                    </div>
                </div>
                <ReviewBox poketex={poketex} mobile={true} />
                <hr />
            </div>
        </div>
    );
}