import { Link } from "react-router-dom";
import PoketexModel from "../../../models/PoketexModel";
import { truncateText, formatTextWithNewlines } from "../../Utils/PoketexDetailsUtils";

export const SearchPoketex: React.FC<{ poketex: PoketexModel }> = (props) => {



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
                        <img src={require('../../../Images/PokemonImage/Default-Pokemon.png')}
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
                        <Link to={`/user/${props.poketex.username}`}>
                            <h6 className='card-title'>
                                {props.poketex.username}
                            </h6>
                        </Link>
                        <p className='card-txt'>
                            {formattedDescription}
                        </p>
                    </div>
                </div>
                <div className='col-md-2 d-flex justify-content-center align-items-center'>
                    <Link className='btn main-color-gray-button btn-m' to={`/pokemon/${props.poketex.id}`}>
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    )
}