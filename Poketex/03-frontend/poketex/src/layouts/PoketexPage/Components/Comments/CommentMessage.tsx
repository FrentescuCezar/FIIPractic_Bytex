import CommentModel from "../../../../models/CommentModel";
import { StarsComment } from "./StarsComment";

export const CommentMessage: React.FC<{ comment: CommentModel }> = (props) => {

    const date = new Date(props.comment.date);
    const longMonth = date.toLocaleString('default', { month: 'long' });
    const dateDay = date.getDate();
    const dateYear = date.getFullYear();

    const dateRender = longMonth + ' ' + dateDay + ', ' + dateYear;


    const userEmail = props.comment.userName;

    return (
        <div>
            <div className='col-sm-8 col-md-8'>
                <h5>
                    {props.comment.userName}
                </h5>
                <div className='row'>
                    <div className='col'>
                        {dateRender}
                    </div>
                    <div className='mt-2'>
                        <StarsComment rating={props.comment.rating} size={27} />
                    </div>
                </div>
                <div className='mt-2'>
                    <p>
                        {props.comment.commentDescription}
                    </p>
                </div>
                <hr />
            </div>
        </div>

    );
}