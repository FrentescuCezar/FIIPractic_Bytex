import { useEffect, useState } from 'react'

import PoketexModel from '../../models/PoketexModel';

import { SpinnerLoading } from '../Utils/SpinnerLoading';

import { CommentBox } from './Components/CommentBox';
import CommentModel from '../../models/CommentModel';
import { LatestComments } from './Components/LatestComments';
import CommentRequestModel from '../../models/CommentRequestModel';
import { StarsComment } from './Components/StarsComment';

import { useOktaAuth } from '@okta/okta-react';


import { Pagination } from '../Utils/Pagination';
import { RelatedPoketexes } from './Components/RelatedPoketexes';
import { SearchPoketex } from '../SearchPoketexesPage/Components/SearchPoketex';
import { Link } from 'react-router-dom';

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


    const [isCommentLeft, setIsCommentLeft] = useState<boolean>(false);

    const [firstTimeLoadingThePage, setFirstTimeLoadingThePage] = useState<boolean>(true);




    //Load the pokemon info
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





    // Load all comments
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




    // Load if user has left a comment
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
                setIsCommentLeft(userCommentResponseJson);
            }
        }
        fetchUserCommentPokemon().catch((error: any) => {
            setCommentsError('Something went wrong!');
        })
    }, [authState, poketexId])




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
        const response = await fetch(url, requestOptons);
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        setIsCommentLeft(true);
    }












    //LOAD RELATED POKEMONS
    const [poketexes, setPoketexes] = useState<PoketexModel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [poketexesPerPage] = useState(8);
    const [totalAmountOfPoketexes, setTotalAmountOfPoketexes] = useState(0);
    const [totalPages, setTotalPages] = useState(0);



    useEffect(() => {
        const fetchRelatedPokemons = async () => {
            const serachNameAndPrompt = poketex?.name + ' ' + poketex?.prompt;
            const searchWords = serachNameAndPrompt?.trim().split(/\s+/) ?? [];
            const stopWords = ['a', 'the', 'an', 'and', 'or', 'in', 'on', 'at', 'with', 'by', 'made', 'without'];
            const filteredPrompt = searchWords.filter(word => !stopWords.includes(word.toLowerCase()));


            let baseUrl: string = `http://localhost:8084/api/related?prompt=${filteredPrompt}`;
            const url: string = `${baseUrl}&page=${currentPage - 1}&size=${poketexesPerPage}`;

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
                const id: number = data.id;

                const poketex = new PoketexModel(
                    id, data.name, data.username,
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
        fetchRelatedPokemons().catch((error: any) => {
            setIsLoading(false);
        })

        if (firstTimeLoadingThePage) {
            setFirstTimeLoadingThePage(false);
        } else {
            //window.scrollTo(0, 1200);  //THIS IS IF YOU WANT TO SCROLL TO TOP WHEN YOU CHANGE PAGE FGM
        }



    }, [currentPage, poketex]);



    const indexOfLastPoketex: number = currentPage * poketexesPerPage;
    const indexOfFirstPoketex: number = indexOfLastPoketex - poketexesPerPage;

    let lastItem = poketexesPerPage * currentPage <= totalAmountOfPoketexes ?
        poketexesPerPage * currentPage : totalAmountOfPoketexes;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);



























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




    const paragraphs = poketex?.description.split('.').filter(Boolean) ?? [];
    const numParagraphs = paragraphs.length;
    const paragraphsPerSection = Math.ceil(numParagraphs / 3);

    const sectionedText = [];
    for (let i = 0; i < numParagraphs; i += paragraphsPerSection) {
        sectionedText.push(
            <div key={i} style={{ marginBottom: "20px" }}>
                {paragraphs.slice(i, i + paragraphsPerSection).join('. ')}.
            </div>
        );
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
                            <Link to={`/user/${poketex?.username}`}>
                                <h5 className='text-primary'>{poketex?.username}</h5>
                            </Link>
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
                            <p className='lead'>{sectionedText}</p>
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

                    <LatestComments comments={comments} poketexId={poketex?.id} mobile={false} commentsError={commentsError} />
                    {/* COPY PASTE S-A INTAMPLAT AICI*/}
                    <div className='my-4'>

                    </div>
                    <div className='mt-3'>
                        <h5> Number of Related Pokemons: ({totalAmountOfPoketexes})</h5>
                    </div>
                    <p>
                        {indexOfFirstPoketex + 1} to {lastItem} of {totalAmountOfPoketexes} items:
                    </p>
                    {poketexes.map(poketex => (
                        <RelatedPoketexes poketex={poketex} key={poketex.id} />
                    ))}
                    {totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    }
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
                        <Link to={`/user/${poketex?.username}`}>
                            <h5 className='text-primary'>{poketex?.username}</h5>
                        </Link>
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

                {/* COPY PASTE S-A INTAMPLAT AICI*/}
                <div className='mt-3'>
                    <h5> Number of Related Pokemons: ({totalAmountOfPoketexes})</h5>
                </div>
                <p>
                    {indexOfFirstPoketex + 1} to {lastItem} of {totalAmountOfPoketexes} items:
                </p>
                {poketexes.map(poketex => (
                    <RelatedPoketexes poketex={poketex} key={poketex.id} />
                ))}
                {totalPages > 1 &&
                    <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                }
            </div>

        </div>
    );
}