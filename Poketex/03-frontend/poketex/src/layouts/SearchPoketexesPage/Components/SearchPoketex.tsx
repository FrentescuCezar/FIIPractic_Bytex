import { Link } from "react-router-dom";
import PoketexModel from "../../../models/PoketexModel";

export const SearchPoketex: React.FC<{ poketex: PoketexModel }> = (props) => {

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


    const MAX_LENGTH_DESCRIPTION = 400;
    const truncatedDescription = truncateText(props.poketex.description, MAX_LENGTH_DESCRIPTION);
    const formattedDescription = formatTextWithNewlines(truncatedDescription);


    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-3 d-flex justify-content-center align-items-center'>
                    {props.poketex.image ?
                        <Link to={`/pokemon/${props.poketex.id}`}>
                            <img src={`data:image/png;base64,${props.poketex.image}`}
                                width='200'
                                height='200'
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
                </div>
                <div className='col-md-6 d-flex flex-column justify-content-center'>
                    <div className='card-body'>
                        <h3>
                            {props.poketex.name}
                        </h3>
                        <h6 className='card-title'>
                            {props.poketex.username}
                        </h6>
                        <p className='card-txt'>
                            {formattedDescription}
                        </p>
                    </div>
                </div>
                <div className='col-md-2 d-flex justify-content-center align-items-center'>
                    <Link className='btn btn-md main-color text-white' to={`/pokemon/${props.poketex.id}`}>
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    )
}