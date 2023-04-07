import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import PoketexModel from '../../models/PoketexModel';

import { SpinnerLoading } from '../Utils/SpinnerLoading';

import { CommentBox } from './Components/Comments/CommentBox';
import CommentModel from '../../models/CommentModel';
import { LatestComments } from './Components/Comments/LatestComments';
import CommentRequestModel from '../../models/CommentRequestModel';
import { StarsComment } from './Components/Comments/StarsComment';

import { useOktaAuth } from '@okta/okta-react';


import { Pagination } from '../Utils/Pagination';
import { RelatedPoketex } from './Components/RelatedPoketexes';
import { Link } from 'react-router-dom';


import PokemonStats from './Components/PoketexStats/PoketexStats';
import Seed from './Components/PoketexStats/Seed';

import jwt_decode from 'jwt-decode';
import { extractNameFromEmail } from '../Utils/PoketexDetailsUtils';
import { fetchComments, fetchParent, fetchPoketex, fetchRelatedPokemons, fetchUserCommentPokemon } from './Api/PoketexApi';


export const PoketexPage = () => {


    const { authState } = useOktaAuth();

    interface JwtPayload {
        sub: string;
    }

    let JWTDecoded;
    let usernameWithoutAtSymbol;


    if (authState && authState.isAuthenticated) {
        JWTDecoded = jwt_decode<JwtPayload>(authState.accessToken.accessToken);
        usernameWithoutAtSymbol = extractNameFromEmail(JWTDecoded.sub);
    } else {
        JWTDecoded = { sub: "Not_Logged_In" };
        usernameWithoutAtSymbol = "Not_Logged_In";
    }


    const { poketexId } = useParams<{ poketexId: string }>();



    const [poketex, setPoketex] = useState<PoketexModel>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [poketexError, setPoketexError] = useState<string | null>(null);


    // Parents
    const [parent1Data, setParent1Data] = useState(null);
    const [parent2Data, setParent2Data] = useState(null);



    // Comment state
    const [comments, setComments] = useState<CommentModel[]>([])
    const [totalStars, setTotalStars] = useState<number>(0)
    const [isLoadingComment, setIsLoadingComment] = useState<boolean>(true)
    const [commentsError, setCommentsError] = useState<string | null>(null);



    const [isCommentLeft, setIsCommentLeft] = useState<boolean>(false);




    //Load the pokemon info
    useEffect(() => {
        fetchPoketex(poketexId)
            .then((loadedPoketex) => {
                setPoketex(loadedPoketex);
                setIsLoading(false);
            })
            .catch((error: any) => {
                setIsLoading(false);
                setPoketexError(error.message);
            });
    }, [poketexId]);


    //Load the Parents info
    useEffect(() => {
        if (poketex?.parent1) {
            fetchParent(poketex.parent1)
                .then((data) => setParent1Data(data))
                .catch((error) => console.error('Error fetching parent1:', error));
        }

        if (poketex?.parent2) {
            fetchParent(poketex.parent2)
                .then((data) => setParent2Data(data))
                .catch((error) => console.error('Error fetching parent2:', error));
        }
    }, [poketex, poketexId]);



    // Load all comments
    useEffect(() => {
        const fetchAndSetComments = async () => {
            try {
                const loadedComments = await fetchComments(poketexId);
                let weightedStarComments: number = 0;

                for (const comment of loadedComments) {
                    weightedStarComments += comment.rating;
                }

                if (loadedComments.length > 0) {
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

        fetchAndSetComments();
    }, [isCommentLeft, poketexId]);




    // Load if user has left a comment
    useEffect(() => {
        fetchUserCommentPokemon(authState, poketexId)
            .then((userCommentResponseJson) => {
                setIsCommentLeft(userCommentResponseJson);
            })
            .catch((error: any) => {
                setCommentsError(error);
            });
    }, [authState, poketexId])



    // Submit Comment
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
    const [relatedPoketexes, setRelatedPoketexes] = useState<PoketexModel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [poketexesPerPage] = useState(8);
    const [totalAmountOfRelatedPoketexes, setTotalAmountOfRelatedPoketexes] = useState(0);
    const [totalPages, setTotalPages] = useState(0);


    //LOAD RELATED POKEMONS
    useEffect(() => {
        const fetchAndSetRelatedPokemons = async () => {
            try {
                const { relatedPoketexes, totalAmountOfRelatedPoketexes, totalPages } = await fetchRelatedPokemons(currentPage, poketexesPerPage, poketex);

                setRelatedPoketexes(relatedPoketexes);
                setTotalAmountOfRelatedPoketexes(totalAmountOfRelatedPoketexes);
                setTotalPages(totalPages);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        fetchAndSetRelatedPokemons();
    }, [currentPage, poketex]);








    // Parent card
    interface ParentCardProps {
        parent: PoketexModel | null;
    }

    const ParentCard: React.FC<ParentCardProps> = ({ parent }) => {
        if (!parent) return null;

        return (
            <div className="card text-center">
                <Link to={`/${parent.id}`}>
                    <img
                        src={`data:image/png;base64,${parent.image}`}
                        className="card-img-top mx-auto"
                        alt={parent.name}
                    />
                </Link>

                <div className="card-body">
                    <h5 className="card-title">{parent.name}</h5>
                    <Link to={`/user/${parent.username}`}>
                        <h6 className="text-primary mx-auto">{parent.username}</h6>
                    </Link>
                </div>
            </div>
        );
    };




    // PAGINATION
    const indexOfLastPoketex: number = currentPage * poketexesPerPage;
    const indexOfFirstPoketex: number = indexOfLastPoketex - poketexesPerPage;

    let lastItem = poketexesPerPage * currentPage <= totalAmountOfRelatedPoketexes ?
        poketexesPerPage * currentPage : totalAmountOfRelatedPoketexes;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);




    // Description Sections
    const paragraphs = poketex?.description.split('.').filter(Boolean) ?? [];
    const numParagraphs = paragraphs.length;
    const paragraphsPerSection = Math.ceil(numParagraphs / 3);

    const sectionedDescription = [];
    for (let i = 0; i < numParagraphs; i += paragraphsPerSection) {
        sectionedDescription.push(
            <div key={i} style={{ marginBottom: "20px" }}>
                {paragraphs.slice(i, i + paragraphsPerSection).join('. ')}.
            </div>
        );
    }


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
                            <Seed seed={poketex?.seed} />
                            <div className='my-5'>
                                <PokemonStats
                                    hp={poketex?.hp}
                                    attack={poketex?.attack}
                                    defense={poketex?.defense}
                                    spDefense={poketex?.spDefense}
                                    speed={poketex?.speed}
                                    baseTotal={poketex?.baseTotal}
                                />
                            </div>


                        </div>
                    </div>
                    <div className='col-4 col-md-7 container'>
                        <div className='ml-2'>
                            <div className='lead'>{sectionedDescription}</div>
                        </div>
                        {parent1Data && parent2Data
                            ?
                            <div className='mt-5 text-center'>
                                <h2 className='mb-4'>Parents</h2>
                                <div className='d-flex justify-content-center align-items-center'>
                                    <ParentCard parent={parent1Data} />
                                    <p className='mx-3'><b>+</b></p>
                                    <ParentCard parent={parent2Data} />
                                </div>
                            </div>
                            :
                            <></>
                        }
                        <div className='my-5'>
                            <h3 className='text-center'>Want to breed with another Pokemon?</h3>
                            {authState?.isAuthenticated
                                ?
                                <Link to={`/user/${usernameWithoutAtSymbol}/pokemon/${poketex?.id}`}>
                                    <button className='btn btn-primary mx-auto d-block'>Breed</button>
                                </Link>
                                :
                                <Link to={`/login`}>
                                    <button className='btn btn-primary mx-auto d-block'>Breed</button>
                                </Link>
                            }

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
                        <h5> Number of Related Pokemons: ({totalAmountOfRelatedPoketexes})</h5>
                    </div>
                    <p>
                        {indexOfFirstPoketex + 1} to {lastItem} of {totalAmountOfRelatedPoketexes} items:
                    </p>
                    {relatedPoketexes.map(poketex => (
                        <RelatedPoketex poketex={poketex} key={poketex.id} />
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
                        <div className='d-flex flex-column align-items-center'>
                            <h2>{poketex?.name}</h2>
                            <Link to={`/user/${poketex?.username}`}>
                                <h5 className='text-primary'>{poketex?.username}</h5>
                            </Link>
                            <div className="d-flex flex-row">
                                <StarsComment rating={totalStars} size={40} />
                            </div>
                            <Seed seed={poketex?.seed} />
                            <PokemonStats
                                hp={poketex?.hp}
                                attack={poketex?.attack}
                                defense={poketex?.defense}
                                spDefense={poketex?.spDefense}
                                speed={poketex?.speed}
                                baseTotal={poketex?.baseTotal}
                            />
                        </div>
                        <p className='lead'>{sectionedDescription}</p>
                        {parent1Data && parent2Data
                            ?
                            <div className='mt-5 text-center'>
                                <h2 className='mb-4'>Parents</h2>
                                <div className='d-flex justify-content-center align-items-center'>
                                    <ParentCard parent={parent1Data} />
                                    <p className='mx-3'><b>+</b></p>
                                    <ParentCard parent={parent2Data} />
                                </div>
                            </div>
                            :
                            <></>
                        }
                        <h3 className='text-center'>Want to breed with another Pokemon?</h3>
                        <Link to={`/user/${usernameWithoutAtSymbol}/${poketex?.id}`}>
                            <button className='btn btn-primary mx-auto d-block'>Breed</button>
                        </Link>
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
                    <h5> Number of Related Pokemons: ({totalAmountOfRelatedPoketexes})</h5>
                </div>
                <p>
                    {indexOfFirstPoketex + 1} to {lastItem} of {totalAmountOfRelatedPoketexes} items:
                </p>
                {relatedPoketexes.map(poketex => (
                    <RelatedPoketex poketex={poketex} key={poketex.id} />
                ))}
                {totalPages > 1 &&
                    <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                }
            </div>

        </div>
    );
}