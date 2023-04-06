import React from 'react';

interface SeedProps {
    seed: string | undefined;
}

const Seed: React.FC<SeedProps> = ({ seed }) => {
    return (
        <div>
            <p>Seed: {seed}</p>
        </div>
    );
};

export default Seed;