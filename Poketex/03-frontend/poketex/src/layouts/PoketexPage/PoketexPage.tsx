import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import PoketexModel from '../../models/PoketexModel';

import { SpinnerLoading } from '../Utils/SpinnerLoading';

import { CommentBox } from './Components/CommentBox';
import CommentModel from '../../models/CommentModel';
import { LatestComments } from './Components/LatestComments';
import CommentRequestModel from '../../models/CommentRequestModel';
import { StarsComment } from './Components/StarsComment';

import { useOktaAuth } from '@okta/okta-react';

export const PoketexPage = () => {

    const { authState } = useOktaAuth();

    const [poketex, setPoketex] = useState<PoketexModel>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [poketexError, setPoketexError] = useState<string | null>(null);






    // Comment state
    const [comments, setComments] = useState<CommentModel[]>([])
    const [totalStars, setTotalStars] = useState<number>(0)
    const [isLoadingComment, setIsLoadingComment] = useState<boolean>(true)
    const [commentsError, setCommentsError] = useState<string | null>(null);

    const poketexId = (window.location.pathname).split("/")[2];


    console.log(window.location.pathname)
    console.log(poketexId)

    const [isCommentLeft, setIsCommentLeft] = useState<boolean>(false);
    const [isLoadingUserComment, setIsLoadingUserComment] = useState<boolean>(true);





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
            setPoketexError(error.message);
        })
    }, [poketexId]);





    useEffect(() => {
        const fetchComments = async () => {
            const commentUrl: string = 'http://localhost:8086/commentapi/comments/search/findByPokemonId?pokemonId=' + poketexId;

            try {
                const responseComment = await fetch(commentUrl);
                if (!responseComment.ok) {
                    console.error('The comments are not showing!');
                    setComments([]);
                    setIsLoadingComment(false);
                    return;
                }
                const responseJsonComments = await responseComment.json();
                const responseData = responseJsonComments._embedded.comments;
                const loadedComments: CommentModel[] = [];
                let weightedStarComments: number = 0;
                for (const key in responseData) {
                    loadedComments.push({
                        id: responseData[key].id,
                        userEmail: responseData[key].userEmail,
                        date: responseData[key].date,
                        rating: responseData[key].rating,
                        pokemonId: responseData[key].pokemonId,
                        commentDescription: responseData[key].commentDescription
                    });
                    weightedStarComments += responseData[key].rating;
                }
                if (loadedComments) {
                    const round = (Math.round((weightedStarComments / loadedComments.length) * 2) / 2).toFixed(1);
                    setTotalStars(Number(round));
                }
                setComments(loadedComments);
                setIsLoadingComment(false);
            } catch (error) {
                console.error(error);
                setComments([]);
                setCommentsError('The comments are not showing!');
                setIsLoadingComment(false);
            }
        };
        fetchComments();
    }, [isCommentLeft, poketexId]);




    useEffect(() => {
        const fetchUserCommentPokemon = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8086/commentapi/comments/user/pokemon?pokemonId=${poketexId}`;
                const requestOptons = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                };
                const userComment = await fetch(url, requestOptons);
                if (!userComment.ok) {
                    throw new Error('Something went wrong!');
                }
                const userCommentResponseJson = await userComment.json();
                console.log(authState)
                console.log(userCommentResponseJson)
                setIsCommentLeft(userCommentResponseJson);
            }
            setIsLoadingUserComment(false);
        }
        fetchUserCommentPokemon().catch((error: any) => {
            setIsLoadingUserComment(false);
            setCommentsError('Something went wrong!');
        })
    }, [authState, poketexId])




    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (poketexError) {
        return (
            <div className='container m-5'>
                <p>{poketexError}</p>
            </div>
        )
    }


    async function submitComment(starInput: number, commentDescription: string) {
        let pokemonId: number = 0;
        if (poketex?.id) {
            pokemonId = poketex.id;
        }

        const commentRequestModel = new CommentRequestModel(pokemonId, starInput, commentDescription);
        const url = `http://localhost:8086/commentapi/comments/`;
        const requestOptons = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentRequestModel)
        };
        console.log(requestOptons)
        const response = await fetch(url, requestOptons);
        console.log(response)
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        setIsCommentLeft(true);
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
                            <div className="container">
                                <div className="d-flex flex-row">
                                    <StarsComment rating={totalStars} size={40} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-4 col-md-7 container'>
                        <div className='ml-2'>
                            <p className='lead'>{poketex?.description}</p>
                        </div>
                    </div>
                    <CommentBox poketex={poketex}
                        mobile={false}
                        isAuthenticated={authState?.isAuthenticated}
                        isCommentLeft={isCommentLeft}
                        submitComment={submitComment}
                        isLoadingComment={isLoadingComment}
                        commentsError={commentsError}
                    />
                    <hr />
                    <LatestComments comments={comments} poketexId={poketex?.id} mobile={false} commentsError={commentsError} />
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
                        <div className="d-flex flex-row">
                            <StarsComment rating={totalStars} size={40} />
                        </div>
                        <p className='lead'>{poketex?.description}</p>
                    </div>
                </div>
                <CommentBox poketex={poketex}
                    mobile={false}
                    isAuthenticated={authState?.isAuthenticated}
                    isCommentLeft={isCommentLeft}
                    submitComment={submitComment}
                    isLoadingComment={isLoadingComment}
                    commentsError={commentsError}
                />
                <hr />
                <LatestComments comments={comments} poketexId={poketex?.id} mobile={false} commentsError={commentsError} />
            </div>

        </div>
    );
}