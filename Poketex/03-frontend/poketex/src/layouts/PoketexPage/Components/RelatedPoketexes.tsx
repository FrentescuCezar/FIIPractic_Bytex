import { Link } from "react-router-dom";
import PoketexModel from "../../../models/PoketexModel";

export const RelatedPoketexes: React.FC<{ poketex: PoketexModel }> = (props) => {

    function truncateText(text: string, maxLength: number) {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        } else {
            return text;
        }
    }

    function formatTextWithNewlines(text: string) {
        return text.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    }

    const MAX_LENGTH_DESCRIPTION = 170;
    const truncatedDescription = truncateText(props.poketex.description, MAX_LENGTH_DESCRIPTION);
    const formattedDescription = formatTextWithNewlines(truncatedDescription);

    return (
        <div className='col-md-3 col-sm-6 d-inline-flex justify-content-center'>
            <div className='card mt-2 shadow p-3 mb-3 bg-body rounded'>
                <div className='d-flex flex-column align-items-center justify-content-center'>
                    {props.poketex.image ?
                        <Link to={`/${props.poketex.id}`}>
                            <img src={`data:image/png;base64,${props.poketex.image}`}
                                className='card-img-top'
                                alt='Pokemon'
                            />
                        </Link>
                        :
                        <img src={require('../../../Images/BooksImages/book-luv2code-1000.png')}
                            width='200'
                            height='200'
                            alt='Pokemon'
                        />
                    }

                    <div className='card-body text-center'>
                        <h3>
                            {props.poketex.name}
                        </h3>
                        <h6 className='card-title'>
                            {props.poketex.username}
                        </h6>
                        <div>
                            {formattedDescription}
                        </div>
                        <Link className='btn main-color-gray-button btn-m' to={`/pokemon/${props.poketex.id}`}>
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
