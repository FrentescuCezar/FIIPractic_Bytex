import { Link } from "react-router-dom";
import PoketexModel from "../../../models/PoketexModel";

export const CommentBox: React.FC<{ poketex: PoketexModel | undefined, mobile: boolean, isAuthenticated: any, isCommentLeft: boolean }> = (props) => {


    function commentRender() {
        if (props.isAuthenticated && !props.isCommentLeft) {
            return (
                <p>
                    Leave a comment here!
                </p>
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
        <div className={props.mobile ? 'card d-flex mt-5' : 'card d-flex mt-5 my-5'}>
            <div className='card-body container'>

                {commentRender()}
                <hr />

                {/* {isAuthenticated ? <div> : } */}
                {!props.isAuthenticated
                    ?
                    <div>
                        <hr />
                        <Link to='/login' className='btn btn-success btn-lg'>Sign In</Link>
                    </div>
                    :
                    <div>
                    </div>
                }
            </div>
        </div>
    );
}