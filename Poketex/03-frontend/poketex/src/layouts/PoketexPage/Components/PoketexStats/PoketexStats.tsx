import React from 'react';

interface PokemonStatsProps {
    hp: number | undefined;
    attack: number | undefined;
    defense: number | undefined;
    spDefense: number | undefined;
    speed: number | undefined;
    baseTotal: number | undefined;
}

const PokemonStats: React.FC<PokemonStatsProps> = ({ hp, attack, defense, spDefense, speed, baseTotal }) => {
    return (
        <div className="pokemon-stats d-flex">
            <div className="column">
                <div className="stat attack">
                    <p>ATK: {attack}</p>
                </div>
                <div className="stat defense">
                    <p>DEF: {defense}</p>
                </div>
            </div>
            <div className="column">

                <div className="stat hp">
                    <p>HP: {hp}</p>
                </div>
                <div className="stat baseTotal">
                    <p>TOT: {baseTotal}</p>
                </div>
            </div>
            <div className="column">
                <div className="stat spDefense">
                    <p>SpA: {spDefense}</p>
                </div>
                <div className="stat speed">
                    <p>SpD: {speed}</p>
                </div>

            </div>
        </div>
    );
};

export default PokemonStats;