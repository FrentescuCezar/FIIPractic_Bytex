import React from 'react';
import Loading_Image from '../../Images/PublicImages/Pokytex_Loading.png';

const spinnerStyle = {
    width: '100px',
    height: '100px',
    backgroundImage: `url(${Loading_Image})`,
    backgroundSize: 'cover',
    animation: 'spin 2s linear infinite',
};

const keyframesStyle = `
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

export const SpinnerLoading = () => {
    return (
        <div className='d-flex justify-content-center align-items-center' style={{ height: 150 }}>
            <style>
                {keyframesStyle}
            </style>
            <div className='spinner-image' style={spinnerStyle} role='status'>
                <span className='visually-hidden'>
                    Loading ...
                </span>
            </div>
        </div>
    );
};