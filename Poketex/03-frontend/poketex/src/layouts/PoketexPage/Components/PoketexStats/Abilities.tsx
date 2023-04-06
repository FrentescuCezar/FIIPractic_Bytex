import React from 'react';

interface AbilitiesProps {
    abilities: string[] | undefined;
}

const Abilities: React.FC<AbilitiesProps> = ({ abilities }) => {
    return (
        <div className="abilities">
            {abilities?.map((ability, index) => (
                <div key={index} className={`ability ability-${index}`}>
                    <p>{ability}</p>
                </div>
            ))}
        </div>
    );
};
export default Abilities;