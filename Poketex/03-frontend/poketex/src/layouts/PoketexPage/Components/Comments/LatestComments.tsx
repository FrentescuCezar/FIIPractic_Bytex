import { Link } from "react-router-dom";
import CommentModel from "../../../../models/CommentModel";
import { CommentMessage } from "./CommentMessage";

export const LatestComments: React.FC<{
    comments: CommentModel[]; poketexId: number | undefined, mobile: boolean, commentsError: string | null
}> = (props) => {

    function commentRender() {
        if (props.commentsError !== null) {
            return (
                <p>The comments are not available right now!</p>
            )
        } else {
            return (
                <div className={props.mobile ? 'mt-3' : 'row mt-5'}>
                    <div className={props.mobile ? '' : 'col-sm-2 col-md-2'}>
                        <h2> Latest Comments:</h2>
                    </div>
                    <div className='col-sm-10 col-md-10'>
                        {props.comments.length > 0 ?
                            <>
                                {props.comments.slice(0, 3).map((comment) => (
                                    <CommentMessage comment={comment} key={comment.id}></CommentMessage>
                                ))}

                                <div className='m-3'>
                                    <Link type='button' className='btn main-color btn-md text-white' to={`/commentList/${props.poketexId}`}>
                                        See all comments
                                    </Link>
                                </div>
                            </>
                            :
                            <div className='m-3'>
                                <p className='lead'>
                                    No comments yet. Rip.
                                </p>
                            </div>

                        }


                    </div>
                    {
                        props.comments.length > 0
                            ?
                            <></>
                            :
                            <hr />
                    }
                </div>
            )
        }
    }


    return (
        commentRender()
    );
}