import { useEffect, useState } from "react";
import CommentModel from "../../../../../models/CommentModel";
import { SpinnerLoading } from "../../../../Utils/SpinnerLoading";
import { CommentMessage } from "../CommentMessage";
import { Pagination } from "../../../../Utils/Pagination";

export const CommentListPage = () => {

    const [comments, setComments] = useState<CommentModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [httpError, setHttpError] = useState(null);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [commentsPerPage] = useState(5);
    const [totalAmountOfComments, setTotalAmountOfComments] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const poketexId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchComments = async () => {
            const commentUrl: string = `http://localhost:8086/commentapi/comments/search/findByPokemonId?pokemonId=${poketexId}&page=${currentPage - 1}&size=${commentsPerPage}`;

            const responseComment = await fetch(commentUrl);

            if (!responseComment.ok) {
                throw new Error('The comments are not showing!');
            }

            const responseJsonComments = await responseComment.json();

            const responseData = responseJsonComments._embedded.comments;

            setTotalAmountOfComments(responseJsonComments.page.totalElements);
            setTotalPages(responseJsonComments.page.totalPages);

            const loadedComments: CommentModel[] = [];


            for (const key in responseData) {
                loadedComments.push({
                    id: responseData[key].id,
                    userName: responseData[key].userName,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    pokemonId: responseData[key].pokemonId,
                    commentDescription: responseData[key].commentDescription

                });
            }


            setComments(loadedComments);
            setIsLoading(false);
        };

        fetchComments().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })

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

    const indexOfLastComment: number = currentPage * commentsPerPage;
    const indexOfFirstComment: number = indexOfLastComment - commentsPerPage;

    let lastItem = commentsPerPage * currentPage <= totalAmountOfComments ? commentsPerPage * currentPage : totalAmountOfComments;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className='container m-5'>
            <div className='container m-5 '>
                <div >
                    <h2>Comments: ({comments.length})</h2>
                </div>
                <p>
                    {indexOfFirstComment + 1} to {lastItem} of {totalAmountOfComments} comments:
                </p>
                <div className='row my-5'>
                    {comments.map(comment => (
                        <CommentMessage comment={comment} key={comment.id} />
                    ))}
                </div>
                {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
            </div>
        </div>

    );
}