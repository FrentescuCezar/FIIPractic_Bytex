import { Link } from "react-router-dom";
import CommentModel from "../../models/CommentModel";
import { CommentUtil } from "../Utils/CommentUtil";

export const LatestComments: React.FC<{
    comments: CommentModel[]; poketexId: number | undefined, mobile: boolean
}> = (props) => {
    return (
        <div className={props.mobile ? 'mt-3' : 'row mt-5'}>
            <div className={props.mobile ? '' : 'col-sm-2 col-md-2'}>
                <h2> Latest Comments:</h2>
            </div>
            <div className='col-sm-10 col-md-10'>
                {props.comments.length > 0 ?
                    <>
                        {props.comments.slice(0, 3).map((comment) => (
                            <CommentUtil comment={comment} key={comment.id}></CommentUtil>
                        ))}

                        <div className='m-3'>
                            <Link type='button' className='btn main-color btn-md text-white' to='#'>
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
        </div>
    );
}