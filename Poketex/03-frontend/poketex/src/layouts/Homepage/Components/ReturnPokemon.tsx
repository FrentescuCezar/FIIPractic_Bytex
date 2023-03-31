import React from 'react'
import PoketexModel from '../../../models/PoketexModel'

export const ReturnPokemon: React.FC<{ poketex: PoketexModel }> = (props) => {
    return (
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
            <div className='text-center'>
                {props.poketex.image ?
                    <img src={`data:image/png;base64,${props.poketex.image}`}
                        width='256'
                        height='256'
                        alt="Pokemon"
                    />
                    :
                    <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                        width='256'
                        height='256'
                        alt="Pokemon"
                    />
                }

                <h6 className='mt-2'>{props.poketex.name}</h6>
                <p>{props.poketex.username}</p>
                <a className='btn main-color-red text-white' href='#'>Cacat</a>
            </div>
        </div>
    )
}