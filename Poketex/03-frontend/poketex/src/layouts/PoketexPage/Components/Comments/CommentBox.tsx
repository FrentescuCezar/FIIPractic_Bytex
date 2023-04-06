import { Link } from "react-router-dom";
import PoketexModel from "../../../../models/PoketexModel";
import { LeaveAComment } from "./LeaveAComment";

export const CommentBox: React.FC<{
    poketex: PoketexModel | undefined,
    mobile: boolean,
    isAuthenticated: any,
    isCommentLeft: boolean,
    submitComment: any
    isLoadingComment: boolean
    commentsError: string | null
}> = (props) => {


    function commentRender() {
        if (props.commentsError !== null) {
            return (
                <p>The comments are not available right now!</p>
            )
        } else if (props.isAuthenticated && !props.isCommentLeft) {
            return (
                <LeaveAComment submitComment={props.submitComment} />
            )
        } else if (props.isAuthenticated && props.isCommentLeft === true) {
            return (
                <p>
                    <b>Thank you for your comment!</b>
                </p>
            )
        }
        return (
            <div>
                <p>Sign in to be able to leave a comment.</p>
            </div>
        )
    }



    return (
        <div className={props.mobile ? 'card d-flex mt-5' : 'card d-flex mt-5 my-3'}>
            <div className='card-body container'>
                {commentRender()}
                <hr />

                {!props.isAuthenticated
                    ?
                    <div>
                        <Link to='/login' className='btn main-color-gray-button btn-lg'>Sign In</Link>
                    </div>
                    :
                    <div>
                    </div>
                }
            </div>
        </div>
    );
}