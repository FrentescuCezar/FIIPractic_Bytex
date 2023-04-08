import { Link } from "react-router-dom";
import PoketexModel from "../../../models/PoketexModel";

export const UserPokemons: React.FC<{ poketex: PoketexModel }> = (props) => {

    function truncateText(text: string, maxLength: number) {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        } else {
            return text;
        }
    }

    const MAX_LENGTH_DESCRIPTION = 170;
    const truncatedDescription = truncateText(props.poketex.description, MAX_LENGTH_DESCRIPTION);


    return (
        <div className='col-lg-3 col-md-4 col-sm-6 col-12 p-2'>
            <div className='card mt-2 shadow p-3 mb-3 bg-body rounded'>
                <div className='d-flex flex-column align-items-center justify-content-center'>
                    {props.poketex.image ?
                        <Link to={`/pokemon/${props.poketex.id}`}>
                            <img src={`data:image/png;base64,${props.poketex.image}`}
                                className='card-img-top'
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

                    <div className='card-body text-center'>
                        <h3>
                            {props.poketex.name}
                        </h3>
                        <div>
                            {truncatedDescription}
                        </div>
                        <Link className='btn main-color-gray-button btn-m my-2' to={`/pokemon/${props.poketex.id}`}>
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
