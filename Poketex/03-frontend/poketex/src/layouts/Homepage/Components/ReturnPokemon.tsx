import React from 'react'
import PoketexModel from '../../../models/PoketexModel'
import { Link } from 'react-router-dom'

export const ReturnPokemon: React.FC<{ poketex: PoketexModel }> = (props) => {
    return (
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
            <div className='text-center'>
                {props.poketex.image ?
                    <Link to={`/pokemon/${props.poketex.id}`}>
                        <img src={`data:image/png;base64,${props.poketex.image}`}
                            width='256'
                            height='256'
                            alt="Pokemon"
                        />
                    </Link>
                    :
                    <img src={require('./../../../Images/PokemonImage/Default-Pokemon.png')}
                        width='256'
                        height='256'
                        alt="Pokemon"
                    />
                }

                <h6 className='mt-2'>{props.poketex.name}</h6>
                <Link to={`/user/${props.poketex.username}`}>
                    <p>{props.poketex.username}</p>
                </Link>

                <Link type='button' className='btn main-color-gray-button btn-m' to={`/pokemon/${props.poketex.id}`}>
                    Details
                </Link>
            </div>
        </div>
    )
}