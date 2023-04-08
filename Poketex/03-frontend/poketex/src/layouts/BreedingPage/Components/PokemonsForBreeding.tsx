import { Link } from "react-router-dom";
import React, { useState } from 'react';

import PoketexModel from "../../../models/PoketexModel";

interface PokemonsForBreedingProps {
    poketex: PoketexModel;
    onChooseForBreeding: (parentId: number) => void;
}


export const PokemonsForBreeding: React.FC<PokemonsForBreedingProps> = ({ poketex, onChooseForBreeding }) => {

    const [isLoading, setIsLoading] = useState(false);



    function truncateText(text: string, maxLength: number) {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        } else {
            return text;
        }
    }

    const MAX_LENGTH_DESCRIPTION = 170;
    const truncatedDescription = truncateText(poketex.description, MAX_LENGTH_DESCRIPTION);

    const handleChooseForBreeding = async () => {
        setIsLoading(true);
        await onChooseForBreeding(poketex.id);
        setIsLoading(false);
    };


    return (
        <div className='col-lg-3 col-md-4 col-sm-6 col-12 p-2'>
            <div className='card mt-2 shadow p-3 mb-3 bg-body rounded'>
                <div className='d-flex flex-column align-items-center justify-content-center'>
                    {poketex.image ?
                        <Link to={`/pokemon/${poketex.id}`}>
                            <img src={`data:image/png;base64,${poketex.image}`}
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
                            {poketex.name}
                        </h3>
                        <div>
                            {truncatedDescription}
                        </div>
                        <Link className='btn main-color-gray-button btn-m my-2' to={`/pokemon/${poketex.id}`}>
                            View Details
                        </Link>
                        <button className="btn main-color-gray-button btn-m my-2" onClick={handleChooseForBreeding}>
                            {isLoading ? 'Breeding...' : 'Choose for Breeding'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
